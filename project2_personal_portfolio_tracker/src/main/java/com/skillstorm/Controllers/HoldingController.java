package com.skillstorm.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.DTOs.HoldingDto;
import com.skillstorm.Models.Holding;
import com.skillstorm.Services.HoldingService;

//TODO cross will need to change
@RestController
@RequestMapping("/v1/holdings")
@CrossOrigin({ "http://127.0.0.1:5500", "http://localhost:4200" })
public class HoldingController {
    private final HoldingService service;

    public HoldingController(HoldingService service) {
        this.service = service;
    }

    // ----- CREATE METHODS -----
    @PostMapping
    public ResponseEntity<Holding> addHolding(@RequestBody HoldingDto dto) {
        return service.addHolding(dto);
    }

    // ----- READ METHODS -----
    // Read all
    @GetMapping
    public ResponseEntity<Iterable<Holding>> getAllHoldings() {
        return service.getAllHoldings();
    }

    // Read one
    @GetMapping("/{accountId}/{securityId}")
    public ResponseEntity<Holding> getHolding(@PathVariable int accountId,
            @PathVariable int securityId) {
        return service.getHolding(accountId, securityId);
    }

    // ----- UPDATE METHODS -----
    @PutMapping("/{accountId}/{securityId}")
    public ResponseEntity<Holding> updateHolding(
            @PathVariable int accountId,
            @PathVariable int securityId,
            @RequestBody HoldingDto dto) {
        return service.updateHolding(accountId, securityId, dto);
    }

    // ----- DELETE METHODS -----
    // Delete one
    @DeleteMapping("/{accountId}/{securityId}")
    public ResponseEntity<Void> deleteHolding(@PathVariable int accountId,
            @PathVariable int securityId) {
        return service.deleteHolding(accountId, securityId);
    }
}
