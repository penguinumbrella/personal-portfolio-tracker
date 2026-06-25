package com.skillstorm.Services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public List<User> getAll() {
        return repo.findAll();
    }

    // REGISTRATION

    public User registerUser(UserDto dto) {
        if (repo.existsByUsername(dto.username())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Username taken. Please use another username.");
        return repo.save(new User(0, dto.username(), dto.email(), dto.passwordHash()));
        
    }

    // VIEW PROFILE
    public User viewProfile(int id) {
        Optional<User> userOptional = repo.findById(id);
        if (userOptional.isPresent()) {
            return userOptional.get();
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
            "User with id " + id + " does not exist in the database.");
    }

    // EDIT PROFILE

    public User updateProfile(int id, UserDto dto) {

        
        if (repo.existsById(id)) {
            User user = repo.findById(id).get();
            if (!user.getUsername().equals(dto.username()) && repo.existsByUsername(dto.username())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Username taken. Please use another username."
                );
            }
            return 
                repo.save(new User(id, dto.username(), dto.email(), dto.passwordHash()))
            ;
        }
        //return null;

        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
            "User with id " + id + " does not exist in the database.");
    }

    public boolean deleteUser(int id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
            "User with id " + id + " does not exist in the database.");
        
    }

    // LOGIN (TODO)
    // LOGOUT (TODO)
    // DATA SCOPING?
    
}
