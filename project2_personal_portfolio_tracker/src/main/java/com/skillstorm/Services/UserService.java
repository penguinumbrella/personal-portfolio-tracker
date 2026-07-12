package com.skillstorm.Services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.UserRepo;
import com.skillstorm.Util.RepoUtils;

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
        if (repo.existsByUsername(dto.username()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username taken. Please use another username.");
        return repo.save(new User(0, dto.username(), dto.email(), dto.passwordHash()));

    }

    // VIEW PROFILE
    public User viewProfile(int id) {
        return RepoUtils.findOrThrow(repo, id, "User");
    }

    // EDIT PROFILE

    public User updateProfile(int id, UserDto dto) {
        User user = RepoUtils.findOrThrow(repo, id, "User");

        if (!user.getUsername().equals(dto.username()) && repo.existsByUsername(dto.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Username taken. Please use another username.");
        }
        return repo.save(new User(id, dto.username(), dto.email(), dto.passwordHash()));
    }

    public boolean deleteUser(int id) {
        RepoUtils.requireExists(repo, id, "User");
        repo.deleteById(id);
        return true;
    }

    // LOGIN (TODO)
    // LOGOUT (TODO)
    // DATA SCOPING?

}
