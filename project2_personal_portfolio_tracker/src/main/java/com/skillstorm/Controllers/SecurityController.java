package com.skillstorm.Controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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

import com.skillstorm.DTOs.SectorBreakdownDto;
import com.skillstorm.DTOs.SecurityDto;
import com.skillstorm.DTOs.SecurityTypeBreakdownDto;
import com.skillstorm.DTOs.TopSecurityDto;
import com.skillstorm.Services.SecurityService;
import com.skillstorm.Models.Security;

/** Manages securities and their aggregate/breakdown data. */
@RestController
@RequestMapping("/v1/securities")
public class SecurityController {

    private final SecurityService service;

    public SecurityController(SecurityService service) {
        this.service = service;
    }

    /**
     * Creates a new security.
     *
     * @param dto the security to create
     * @return the created security with HTTP 201
     */
    @PostMapping
    public ResponseEntity<Security> addSecurity(@RequestBody SecurityDto dto) {
        Security newSec = service.addSecurity(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newSec);
    }

    /**
     * Returns every security across all users.
     *
     * @return all securities
     */
    @GetMapping
    public ResponseEntity<Iterable<Security>> getAllSecurities() {
        return ResponseEntity.ok(service.getAllSecurities());
    }

    /**
     * Returns all securities belonging to one user.
     *
     * @param userId the user's id
     * @return the user's securities
     */
    @GetMapping("/u/{userId}")
    public ResponseEntity<Iterable<Security>> getAllSecuritiesPerUser(@PathVariable int userId) {
        return ResponseEntity.ok(service.getAllSecuritiesPerUser(userId));
    }

    /**
     * Returns a user's securities, paginated and optionally filtered by name search.
     *
     * @param userId the user's id
     * @param page the zero-based page number
     * @param size the page size
     * @param search a name search term, or {@code null} for no filtering
     * @return the requested page of securities, sorted by name
     */
    @GetMapping("/u/{userId}/page")
    public ResponseEntity<Page<Security>> getSecuritiesPerUserPaged(
            @PathVariable int userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String search) {
        Page<Security> result = service.getSecuritiesPerUserPaged(userId, search,
                PageRequest.of(page, size, Sort.by("name")));
        return ResponseEntity.ok(result);
    }

    /**
     * Returns the total number of securities a user has.
     *
     * @param userId the user's id
     * @return the user's total security count
     */
    @GetMapping("total")
    public ResponseEntity<Long> getUserSecurityAccountTotal(@RequestParam(required = true) int userId) {
        return ResponseEntity.status(200).body(service.getUserSecurityAccountTotal(userId));
    }

    /**
     * Returns a user's top 5 securities by total value, for the dashboard.
     *
     * @param userId the user's id
     * @return the user's top securities
     */
    @GetMapping("top")
    public ResponseEntity<Iterable<TopSecurityDto>> getTopSecurities(
            @RequestParam(required = true) int userId) {
        return ResponseEntity.status(200).body(service.getTop5SecurityValues((int) userId));
    }

    /**
     * Returns a count of a user's securities grouped by security type, for the
     * security-type breakdown pie chart.
     *
     * @param userId the user's id
     * @return the user's security type breakdown
     */
    @GetMapping("breakdown/type")
    public ResponseEntity<Iterable<SecurityTypeBreakdownDto>> getSecurityTypeBreakdown(
            @RequestParam(required = true) int userId) {
        return ResponseEntity.ok(service.getSecurityTypeBreakdown(userId));
    }

    /**
     * Returns a count of a user's securities grouped by sector, for the sector breakdown pie chart.
     *
     * @param userId the user's id
     * @return the user's sector breakdown
     */
    @GetMapping("breakdown/sector")
    public ResponseEntity<Iterable<SectorBreakdownDto>> getSectorBreakdown(
            @RequestParam(required = true) int userId) {
        return ResponseEntity.ok(service.getSectorBreakdown(userId));
    }

    /**
     * Returns a single security by id.
     *
     * @param id the security's id
     * @return the matching security
     */
    @GetMapping("/{id}")
    public ResponseEntity<Security> getSecurity(@PathVariable int id) {
        return ResponseEntity.ok(service.getSecurity(id));
    }

    /**
     * Updates an existing security.
     *
     * @param id the security's id
     * @param dto the updated security data
     * @return the updated security
     */
    @PutMapping("/{id}")
    public ResponseEntity<Security> updateSecurity(
            @PathVariable int id,
            @RequestBody SecurityDto dto) {
        return ResponseEntity.ok(service.updateSecurity(id, dto));
    }

    /**
     * Deletes a security. The service either returns successfully or throws, so there's no
     * boolean result to check here.
     *
     * @param id the security's id
     * @return HTTP 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSecurity(@PathVariable int id) {
        service.deleteSecurity(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
