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

import com.skillstorm.DTOs.SecurityDto;
import com.skillstorm.Services.SecurityService;
import com.skillstorm.Models.Security;

@RestController
@RequestMapping("/v1/securities")
public class SecurityController {

    private final SecurityService service;

    public SecurityController(SecurityService service) {
        this.service = service;
    }

    // ----- POST/CREATE METHODS -----
    @PostMapping
    public ResponseEntity<Security> addSecurity(@RequestBody SecurityDto dto) {
        Security newSec = service.addSecurity(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newSec);
    }

    // ----- GET/READ METHODS -----
    // Read all
    @GetMapping
    public ResponseEntity<Iterable<Security>> getAllSecurities() {
        return ResponseEntity.ok(service.getAllSecurities());
    }

    // Read all per User
    @GetMapping("/u/{userId}")
    public ResponseEntity<Iterable<Security>> getAllSecuritiesPerUser(@PathVariable int userId) {
        return ResponseEntity.ok(service.getAllSecuritiesPerUser(userId));
    }

    // Read one
    @GetMapping("/{id}")
    public ResponseEntity<Security> getSecurity(@PathVariable int id) {
        return ResponseEntity.ok(service.getSecurity(id));
    }

    // ----- PUT/UPDATE METHODS -----
    @PutMapping("/{id}")
    public ResponseEntity<Security> updateSecurity(
            @PathVariable int id,
            @RequestBody SecurityDto dto) {
        return ResponseEntity.ok(service.updateSecurity(id, dto));
    }

    // ----- DELETE METHODS -----
    // Delete one
    // Service either returns true or throws, so no need to check bool returned
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSecurity(@PathVariable int id) {
        service.deleteSecurity(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("total")
    public ResponseEntity<Long> getUserSecurityAccountTotal(@RequestParam(required = true) int userId) {
        return ResponseEntity.status(200).body(service.getUserSecurityAccountTotal(userId));
    }

    @GetMapping("recent")
    public ResponseEntity<Iterable<Security>> getRecentSecurities(
            @RequestParam(required = true) Long userId) {
        return ResponseEntity.status(200).body(service.getRecentSecurities(userId));
    }

}
