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

/**
 * Business logic for user registration, profile management, and Spring Security's
 * {@link UserDetailsService} lookup used during authentication.
 */
@Service
public class UserService implements UserDetailsService {

    private final UserRepo repo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepo repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Returns every user account.
     *
     * @return all users
     */
    public List<User> getAll() {
        return repo.findAll();
    }

    /**
     * Registers a new user account with an encoded password.
     *
     * @param dto the new user's details
     * @return the created user
     * @throws ResponseStatusException with status 409 if the username is already taken
     */
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

    /**
     * Returns a single user's profile by id.
     *
     * @param id the user's id
     * @return the matching user profile
     * @throws ResponseStatusException with status 404 if no such user exists
     */
    public User viewProfile(int id) {
        return RepoUtils.findOrThrow(repo, id, "User");
    }

    /**
     * Returns a single user's profile by username.
     *
     * @param username the user's username
     * @return the matching user profile
     * @throws UsernameNotFoundException if no user with that username exists
     */
    public User viewProfileByUsername(String username) {
        return repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with username: " + username));
    }

    /**
     * Loads a user by username for Spring Security authentication, converting their
     * {@link RoleType} into a granted authority.
     *
     * @param username the user's username
     * @return the user's Spring Security details, including their {@code ROLE_*} authority
     * @throws UsernameNotFoundException if no user with that username exists
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with username: " + username));

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

    /**
     * Updates an existing user's profile.
     *
     * @param id the user's id
     * @param dto the updated profile details
     * @return the updated user profile
     * @throws ResponseStatusException with status 404 if the user doesn't exist, or 409 if the
     *         new username is already taken by another user
     */
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

    /**
     * Deletes a user account by disabling it (soft delete).
     *
     * @param id the user's id
     * @return {@code true} once the user has been disabled
     * @throws ResponseStatusException with status 404 if no such user exists
     */
    public boolean deleteUser(int id) {
        User user = RepoUtils.findOrThrow(repo, id, "User");
        user.setEnabled(false);
        repo.save(user);
        return true;
    }

}
