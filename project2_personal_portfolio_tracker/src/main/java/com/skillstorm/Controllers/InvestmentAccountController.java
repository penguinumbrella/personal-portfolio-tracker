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

@RestController
@RequestMapping("/v1/investments")
public class InvestmentAccountController {

    private final InvestmentAccountService service;

    public InvestmentAccountController(InvestmentAccountService service) {
        this.service = service;
    }

    // ----- GET/READ METHODS -----

    @GetMapping
    public ResponseEntity<Iterable<InvestmentAccount>> getAccounts(
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.status(200).body(service.getAccounts(userId));
    }

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

    // Get one
    @GetMapping("/{id}")
    public ResponseEntity<InvestmentAccount> getAccount(
            @PathVariable int id) {
        return ResponseEntity.status(200).body(service.getAccount(id));
    }

    // Aggregate helpers

    @GetMapping("/{id}/total-cost")
    public ResponseEntity<Long> getAccountTotalCost(@PathVariable int id) {
        return ResponseEntity.ok(service.getAccountTotalCost(id));
    }

    @GetMapping("total")
    public ResponseEntity<Long> getUserInvestmentAccountTotal(@RequestParam(required = true) int userId) {
        return ResponseEntity.status(200).body(service.getUserInvestmentAccountTotal(userId));
    }

    @GetMapping("recent")
    public ResponseEntity<Iterable<InvestmentAccount>> getRecentAccounts(
            @RequestParam(required = true) Long userId) {
        return ResponseEntity.status(200).body(service.getRecentAccounts(userId));
    }

    @GetMapping("breakdown/type")
    public ResponseEntity<Iterable<AccountTypeBreakdownDto>> getAccountTypeBreakdown(
            @RequestParam(required = true) int userId) {
        return ResponseEntity.ok(service.getAccountTypeBreakdown(userId));
    }

    // POST (ADD ACCOUNT)
    @PostMapping
    public ResponseEntity<InvestmentAccount> addAccount(
            @RequestBody InvestmentAccountDto dto) {
        InvestmentAccount investmentAccount = service.addAccount(dto);
        return ResponseEntity.status(201).body(investmentAccount);
    }

    // PUT (EDIT ACCOUNT)
    @PutMapping("/{id}")
    public ResponseEntity<InvestmentAccount> updateAccount(
            @PathVariable int id,
            @RequestBody InvestmentAccountDto dto) {

        InvestmentAccount investmentAccount = service.updateAccount(id, dto);

        return ResponseEntity.status(200).body(investmentAccount);
    }

    // DELETE (DELETE ACCOUNT)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @PathVariable int id) {

        service.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}
