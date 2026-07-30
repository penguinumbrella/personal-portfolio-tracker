package com.skillstorm.Controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.DTOs.AccountTypeBreakdownDto;
import com.skillstorm.DTOs.InvestmentAccountDto;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Services.InvestmentAccountService;

/** Manages investment accounts and their aggregate/breakdown data. */
@RestController
@RequestMapping("/v1/investments")
public class InvestmentAccountController {

    private final InvestmentAccountService service;

    public InvestmentAccountController(InvestmentAccountService service) {
        this.service = service;
    }

    /**
     * Returns all investment accounts, optionally scoped to one user.
     *
     * @param userId the user's id to filter by, or {@code null} for every account
     * @return the matching investment accounts
     */
    @GetMapping
    public ResponseEntity<Iterable<InvestmentAccount>> getAccounts(
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.status(200).body(service.getAccounts(userId));
    }

    /**
     * Returns a user's investment accounts, paginated and optionally filtered by nickname search.
     *
     * @param userId the user's id
     * @param page the zero-based page number
     * @param size the page size
     * @param search a nickname search term, or {@code null} for no filtering
     * @return the requested page of investment accounts, sorted by nickname
     */
    @GetMapping("/page")
    public ResponseEntity<Page<InvestmentAccount>> getAccountsPaged(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String search) {
        Page<InvestmentAccount> result = service.getAccountsPaged(userId, search,
                PageRequest.of(page, size, Sort.by("nickname")));
        return ResponseEntity.ok(result);
    }

    /**
     * Returns a single investment account by id.
     *
     * @param id the investment account's id
     * @return the matching investment account
     */
    @GetMapping("/{id}")
    public ResponseEntity<InvestmentAccount> getAccount(
            @PathVariable int id) {
        return ResponseEntity.status(200).body(service.getAccount(id));
    }

    /**
     * Returns the total cost basis of all holdings in one account.
     *
     * @param id the investment account's id
     * @return the account's total cost
     */
    @GetMapping("/{id}/total-cost")
    public ResponseEntity<Long> getAccountTotalCost(@PathVariable int id) {
        return ResponseEntity.ok(service.getAccountTotalCost(id));
    }

    /**
     * Returns the total number of investment accounts a user has.
     *
     * @param userId the user's id
     * @return the user's total investment account count
     */
    @GetMapping("total")
    public ResponseEntity<Long> getUserInvestmentAccountTotal(@RequestParam(required = true) int userId) {
        return ResponseEntity.status(200).body(service.getUserInvestmentAccountTotal(userId));
    }

    /**
     * Returns a user's most recently opened investment accounts, for the dashboard.
     *
     * @param userId the user's id
     * @return the user's recent investment accounts
     */
    @GetMapping("recent")
    public ResponseEntity<Iterable<InvestmentAccount>> getRecentAccounts(
            @RequestParam(required = true) Long userId) {
        return ResponseEntity.status(200).body(service.getRecentAccounts(userId));
    }

    /**
     * Returns a count of a user's investment accounts grouped by account type, for the
     * account-type breakdown pie chart.
     *
     * @param userId the user's id
     * @return the user's account type breakdown
     */
    @GetMapping("breakdown/type")
    public ResponseEntity<Iterable<AccountTypeBreakdownDto>> getAccountTypeBreakdown(
            @RequestParam(required = true) int userId) {
        return ResponseEntity.ok(service.getAccountTypeBreakdown(userId));
    }

    /**
     * Creates a new investment account.
     *
     * @param dto the account to create
     * @return the created account with HTTP 201
     */
    @PostMapping
    public ResponseEntity<InvestmentAccount> addAccount(
            @RequestBody InvestmentAccountDto dto) {
        InvestmentAccount investmentAccount = service.addAccount(dto);
        return ResponseEntity.status(201).body(investmentAccount);
    }

    /**
     * Updates an existing investment account.
     *
     * @param id the investment account's id
     * @param dto the updated account data
     * @return the updated account
     */
    @PutMapping("/{id}")
    public ResponseEntity<InvestmentAccount> updateAccount(
            @PathVariable int id,
            @RequestBody InvestmentAccountDto dto) {

        InvestmentAccount investmentAccount = service.updateAccount(id, dto);

        return ResponseEntity.status(200).body(investmentAccount);
    }

    /**
     * Deletes an investment account.
     *
     * @param id the investment account's id
     * @return HTTP 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @PathVariable int id) {

        service.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}
