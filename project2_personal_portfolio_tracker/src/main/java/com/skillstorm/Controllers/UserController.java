package com.skillstorm.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.Models.User;
import com.skillstorm.Services.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Administers user accounts. Registration, profile updates, and lookup-by-username for the
 * signed-in user are handled by {@link AuthController} instead.
 */
@RestController
@RequestMapping("/v1/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    /**
     * Returns every user account.
     *
     * @return all users
     */
    @GetMapping
    public ResponseEntity<Iterable<User>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    /**
     * Returns a single user's profile by id.
     *
     * @param id the user's id
     * @return the matching user profile
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> viewProfile(
            @PathVariable int id) {
        User user = service.viewProfile(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Deletes a user account.
     *
     * @param id the user's id
     * @return HTTP 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable int id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
