package com.skillstorm.Models;

public enum InvestmentType {
    BROKERAGE("Brokerage"),
    TRADITIONAL_IRA("Traditional IRA"),
    ROTH_IRA("Roth Ira"),
    K401("401(k)"),
    HSA("HSA");

    private String name;

    InvestmentType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
