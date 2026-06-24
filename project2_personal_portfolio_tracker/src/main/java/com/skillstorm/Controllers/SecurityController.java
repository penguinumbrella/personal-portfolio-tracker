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

import com.skillstorm.DTOs.SecurityDto;
import com.skillstorm.Services.SecurityService;
import com.skillstorm.Models.Security;

//TODO cross will need to change
@RestController
@RequestMapping("/v1/securities")
@CrossOrigin({ "http://127.0.0.1:5500", "http://localhost:4200" })
public class SecurityController {

    private final SecurityService service;

    public SecurityController(SecurityService service) {
        this.service = service;
    }

    // ----- CREATE METHODS -----
    @PostMapping
    public ResponseEntity<Security> addSecurity(@RequestBody SecurityDto dto) {
        return service.addSecurity(dto);
    }

    // ----- READ METHODS -----
    // Read all
    @GetMapping
    public ResponseEntity<Iterable<Security>> getAllSecurities() {
        return service.getAllSecurities();
    }

    // Read one
    @GetMapping("/{id}")
    public ResponseEntity<Security> getSecurity(@PathVariable int id) {
        return service.getSecurity(id);
    }

    // ----- UPDATE METHODS -----
    @PutMapping("/{id}")
    public ResponseEntity<Security> updateSecurity(
            @PathVariable int id,
            @RequestBody SecurityDto dto) {
        return service.updateSecurity(id, dto);
    }

    // ----- DELETE METHODS -----
    // Delete one
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSecurity(@PathVariable int id) {
        return service.deleteSecurity(id);
    }
}
