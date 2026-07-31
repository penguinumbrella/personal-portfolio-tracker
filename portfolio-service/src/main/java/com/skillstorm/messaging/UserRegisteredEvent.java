package com.skillstorm.messaging;

/**
 * Event published after a user successfully registers.
 * Keep this DTO identical in publisher and subscriber services.
 */
public record UserRegisteredEvent(int userId, String username, String email) {
}
