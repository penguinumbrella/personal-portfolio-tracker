package com.skillstorm.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.User;
import com.skillstorm.Services.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/v1/users")
//@CrossOrigin(origins = "http://127.0.0.1:5500") // TODO: CHANGE THIS
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Iterable<User>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // REGISTRATION
    /**
     * 
     * @param dto:
     *      - username
     *      - email
     *      - password
     * @return
     */
    @PostMapping
    public ResponseEntity<User> registerUser(
        @RequestBody UserDto dto) {

            return ResponseEntity.status(201).body(service.registerUser(dto));
        }
    
    // VIEW PROFILE
    @GetMapping("/{id}")
    public ResponseEntity<User> viewProfile(
        @PathVariable int id) {
        User user = service.viewProfile(id);
        return ResponseEntity.ok(user);
    }
    
    // EDIT PROFILE

    @PutMapping("/{id}")
    public ResponseEntity<User> updateProfile(
        @PathVariable int id,
        @RequestBody UserDto dto) {
            User user = service.updateProfile(id, dto);
            return ResponseEntity.status(200).build();

        }
    
    // DELETE (DELETE ACCOUNT)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable int id) {
        
        return ResponseEntity.noContent().build();
    }

    // USER LOGIN (TODO)
    // USER LOGOUT (TODO)
    // DATA SCOPING?


}
