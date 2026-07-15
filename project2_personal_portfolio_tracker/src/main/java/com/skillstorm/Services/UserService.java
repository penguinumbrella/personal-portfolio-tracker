package com.skillstorm.Services;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.skillstorm.Util.RepoUtils;

import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.RoleType;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.UserRepo;

@Service
public class UserService implements UserDetailsService {

    private final UserRepo repo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepo repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAll() {
        return repo.findAll();
    }

    // REGISTRATION
    @Transactional
    public User registerUser(UserDto dto) {
        if (repo.existsByUsername(dto.username()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username taken. Please use another username.");

        User newUser = new User();
        newUser.setUsername(dto.username());
        newUser.setEmail(dto.email());
        newUser.setEnabled(true);
        newUser.setRole(RoleType.USER);

        // Hash the password before saving
        newUser.setPasswordHash(passwordEncoder.encode(dto.passwordHash()));

        return repo.save(newUser);
    }

    // VIEW PROFILE
    public User viewProfile(int id) {
        return RepoUtils.findOrThrow(repo, id, "User");
    }

    public User viewProfileByUsername(String username) {
        return repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with username: " + username));
    }

    // EDIT PROFILE
    public User updateProfile(int id, UserDto dto) {
        User user = RepoUtils.findOrThrow(repo, id, "User");

        if (!user.getUsername().equals(dto.username()) && repo.existsByUsername(dto.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Username taken. Please use another username.");
        }
        User updatedUser = new User();
        updatedUser.setId(id);
        updatedUser.setUsername(dto.username());
        updatedUser.setEmail(dto.email());
        updatedUser.setPasswordHash(passwordEncoder.encode(dto.passwordHash()));
        updatedUser.setEnabled(user.isEnabled());
        updatedUser.setRole(user.getRole());
        return repo.save(updatedUser);

    }

    // DELETE (sets enabled to false)
    public boolean deleteUser(int id) {
        User user = RepoUtils.findOrThrow(repo, id, "User");
        user.setEnabled(false);
        repo.save(user);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with username: " + username));

        /**
         * Need to convert role into authorities
         */
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                user.isEnabled(),
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                authorities);
    }

    // DATA SCOPING?

}
