package com.skillstorm.Models;

import com.fasterxml.jackson.annotation.JsonValue;

public enum InvestmentType {
    BROKERAGE("Brokerage"),
    TRADITIONAL_IRA("Traditional IRA"),
    ROTH_IRA("Roth IRA"),
    K401("401(k)"),
    HSA("HSA");

    private String name;

    InvestmentType(String name) {
        this.name = name;
    }

    @JsonValue
    public String getName() {
        return name;
    }

}
