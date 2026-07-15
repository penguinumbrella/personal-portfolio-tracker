package com.skillstorm.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.Models.User;
import com.skillstorm.Services.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/v1/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Iterable<User>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // User registation, update, and find by username are handled in AuthController

    // VIEW PROFILE
    @GetMapping("/{id}")
    public ResponseEntity<User> viewProfile(
            @PathVariable int id) {
        User user = service.viewProfile(id);
        return ResponseEntity.ok(user);
    }

    // DELETE (DELETE ACCOUNT)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable int id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
