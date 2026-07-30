package com.skillstorm.Models;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RoleType {

    USER("User");

    private String role;

    RoleType(String role) {
        this.role = role;
    }

    @JsonValue
    public String getRole() {
        return role;
    }

}
