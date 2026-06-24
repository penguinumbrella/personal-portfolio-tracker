package com.skillstorm.Models;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SecurityType {
    TECHNOLOGY("Technology"),
    HEALTHCARE("Healthcare"),
    FINANCIALS("Financials"),
    CONSUMER("Consumer"),
    ENERGY("Energy"),
    INDUSTRIALS("Industrials"),
    UTILITIES("Utilities"),
    REAL_ESTATE("Real Estate");

    private String name;

    SecurityType(String name) {
        this.name = name;
    }

    @JsonValue
    public String getName() {
        return name;
    }

}
