package com.skillstorm.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.skillstorm.Models.Holding;
import com.skillstorm.Services.HoldingService;

/**
 * Retrieves POJOs from Service class
 * Convert to ResponseEntity and return
 */

//TODO cross will need to change
@RestController
@RequestMapping("/v1/holdings")
@CrossOrigin({ "http://127.0.0.1:5500", "http://localhost:4200" })
public class HoldingController {
    private final HoldingService service;

    public HoldingController(HoldingService service) {
        this.service = service;
    }

    // ----- POST/CREATE METHODS -----
    @PostMapping
    public ResponseEntity<Holding> addHolding(@RequestBody HoldingDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addHolding(dto));
    }

    // ----- GET/READ METHODS -----
    // Read all
    @GetMapping
    public ResponseEntity<Iterable<Holding>> getAllHoldings() {
        return ResponseEntity.ok(service.getAllHoldings());
    }

    // Read one
    @GetMapping("/a/{accountId}/s/{securityId}")
    public ResponseEntity<Holding> getHolding(@PathVariable int accountId,
            @PathVariable int securityId) {
        return ResponseEntity.ok(service.getHolding(accountId, securityId));
    }

    // ----- PUT/UPDATE METHODS -----
    @PutMapping("/a/{accountId}/s/{securityId}")
    public ResponseEntity<Holding> updateHolding(
            @PathVariable int accountId,
            @PathVariable int securityId,
            @RequestBody HoldingDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.updateHolding(accountId, securityId, dto));
    }

    // ----- DELETE METHODS -----
    // Delete one
    // Service either returns true or throws, so no need to check bool returned
    @DeleteMapping("/a/{accountId}/s/{securityId}")
    public ResponseEntity<Void> deleteHolding(@PathVariable int accountId,
            @PathVariable int securityId) {
        service.deleteHolding(accountId, securityId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("total")
    public ResponseEntity<Long> UserHoldingTotal(@RequestParam(required = true) Long userId) {
        return ResponseEntity.status(200).body(service.UserHoldingTotal(userId));
    }

    @GetMapping("totalInvestedCost")
    public ResponseEntity<Long> totalInvestedCost(@RequestParam(required = true) Long userId) {
        return ResponseEntity.status(200).body(service.totalInvestedCost(userId));
    }
}
