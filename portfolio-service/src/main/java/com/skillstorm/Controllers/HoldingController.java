package com.skillstorm.Controllers;

import org.springframework.http.HttpStatus;
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

import com.skillstorm.DTOs.HoldingDto;
import com.skillstorm.DTOs.PortfolioValuePointDto;
import com.skillstorm.Models.Holding;
import com.skillstorm.Services.HoldingService;

import java.util.List;

/**
 * Retrieves POJOs from the service layer, wraps them in a {@link ResponseEntity}, and returns them.
 */
@RestController
@RequestMapping("/v1/holdings")
public class HoldingController {
    private final HoldingService service;

    public HoldingController(HoldingService service) {
        this.service = service;
    }

    /**
     * Creates a new holding.
     *
     * @param dto the holding to create
     * @return the created holding with HTTP 201
     */
    @PostMapping
    public ResponseEntity<Holding> addHolding(@RequestBody HoldingDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addHolding(dto));
    }

    /**
     * Returns every holding across all accounts and securities.
     *
     * @return all holdings
     */
    @GetMapping
    public ResponseEntity<Iterable<Holding>> getAllHoldings() {
        return ResponseEntity.ok(service.getAllHoldings());
    }

    /**
     * Returns all holdings for one investment account.
     *
     * @param accountId the investment account's id
     * @return the account's holdings
     */
    @GetMapping("/a/{accountId}")
    public ResponseEntity<Iterable<Holding>> getAllHoldingsPerAccount(@PathVariable int accountId) {
        return ResponseEntity.ok(service.getAllHoldingsPerAccount(accountId));
    }

    /**
     * Returns all holdings of one security, across accounts.
     *
     * @param securityId the security's id
     * @return the holdings of that security
     */
    @GetMapping("/s/{securityId}")
    public ResponseEntity<Iterable<Holding>> getAllHoldingsPerSecurity(@PathVariable int securityId) {
        return ResponseEntity.ok(service.getAllHoldingsPerSecurity(securityId));
    }

    /**
     * Returns a single holding by its account/security composite key.
     *
     * @param accountId the investment account's id
     * @param securityId the security's id
     * @return the matching holding
     */
    @GetMapping("/a/{accountId}/s/{securityId}")
    public ResponseEntity<Holding> getHolding(@PathVariable int accountId,
            @PathVariable int securityId) {
        return ResponseEntity.ok(service.getHolding(accountId, securityId));
    }

    /**
     * Returns the total number of holdings a user has across all their accounts.
     *
     * @param userId the user's id
     * @return the user's total holding count
     */
    @GetMapping("total")
    public ResponseEntity<Long> getUserHoldingTotal(@RequestParam(required = true) Long userId) {
        return ResponseEntity.status(200).body(service.getUserHoldingTotal(userId));
    }

    /**
     * Returns the total cost basis (shares &times; cost per share) invested by a user across all holdings.
     *
     * @param userId the user's id
     * @return the user's total invested cost
     */
    @GetMapping("totalInvestedCost")
    public ResponseEntity<Long> totalInvestedCost(@RequestParam(required = true) Long userId) {
        return ResponseEntity.status(200).body(service.totalInvestedCost(userId));
    }

    /**
     * Updates an existing holding.
     *
     * @param accountId the investment account's id
     * @param securityId the security's id
     * @param dto the updated holding data
     * @return the updated holding
     */
    @PutMapping("/a/{accountId}/s/{securityId}")
    public ResponseEntity<Holding> updateHolding(
            @PathVariable int accountId,
            @PathVariable int securityId,
            @RequestBody HoldingDto dto) {
        return ResponseEntity.ok(service.updateHolding(accountId, securityId, dto));
    }

    /**
     * Deletes a holding. The service either returns successfully or throws, so there's no
     * boolean result to check here.
     *
     * @param accountId the investment account's id
     * @param securityId the security's id
     * @return HTTP 204 No Content
     */
    @DeleteMapping("/a/{accountId}/s/{securityId}")
    public ResponseEntity<Void> deleteHolding(@PathVariable int accountId,
            @PathVariable int securityId) {
        service.deleteHolding(accountId, securityId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /**
     * Returns a user's cumulative portfolio value over time, for the portfolio value chart.
     *
     * @param userId the user's id
     * @return the user's portfolio value history, ordered by date
     */
    @GetMapping("valueHistory")
    public ResponseEntity<List<PortfolioValuePointDto>> getPortfolioValueHistory(
            @RequestParam(required = true) Long userId) {
        return ResponseEntity.ok(service.getPortfolioValueHistory(userId));
    }
}
