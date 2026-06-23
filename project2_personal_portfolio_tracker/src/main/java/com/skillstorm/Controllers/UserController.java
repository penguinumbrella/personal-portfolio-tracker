package com.skillstorm.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "http://127.0.0.1:5500") // TODO: CHANGE THIS
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // REGISTRATION
    @PostMapping
    public ResponseEntity<User> registerUser(
        @RequestBody UserDto dto) {
            return service.registerUser(dto);

        }
    
    // VIEW PROFILE
    @GetMapping("/{id}")
    public ResponseEntity<User> viewProfile(
        @PathVariable int id) {
        return service.viewProfile(id);
    }
    
    // EDIT PROFILE

    @PutMapping("/{id}")
    public ResponseEntity<User> updateProfile(
        @PathVariable int id,
        @RequestBody UserDto dto) {
            return service.editProfile(id, dto);

        }
    

    // USER LOGIN (TODO)
    // USER LOGOUT (TODO)
    // DATA SCOPING?


}
