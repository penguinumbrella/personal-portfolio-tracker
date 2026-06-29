package com.skillstorm.DTOs;

public record UserDto(
        String username,
        String email,
        String passwordHash) {

}
