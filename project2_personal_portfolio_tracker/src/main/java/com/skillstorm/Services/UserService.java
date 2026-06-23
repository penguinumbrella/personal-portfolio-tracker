package com.skillstorm.Services;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.UserRepo;

import io.micrometer.core.ipc.http.HttpSender.Response;

@Service
public class UserService {

    private final UserRepo repo;

    public UserService(UserRepo repo) {
        this.repo = repo;
    }

    public ResponseEntity<Iterable<User>> getAll() {
        return ResponseEntity.ok(repo.findAll());
    }

    // REGISTRATION

    public ResponseEntity<User> registerUser(UserDto dto) {
        return ResponseEntity.status(201).body(
            repo.save(new User(0, dto.username(), dto.email(), dto.passwordHash(), dto.investmentAccounts()))
        );
    }

    // VIEW PROFILE
    public ResponseEntity<User> viewProfile(int id) {
        Optional<User> userOptional = repo.findById(id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        }
        return ResponseEntity.notFound().build();
    }

    // EDIT PROFILE

    public ResponseEntity<User> editProfile(int id, UserDto dto) {
        if (repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.OK).body(
                repo.save(new User(id, dto.username(), dto.email(), dto.passwordHash(), dto.investmentAccounts()))
            );
        }
        return ResponseEntity.notFound().build();
    }

    // LOGIN (TODO)
    // LOGOUT (TODO)
    // DATA SCOPING?
    
}
