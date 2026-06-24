package com.skillstorm.Models;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SectorType {
    TECHNOLOGY("Technology"),
    HEALTHCARE("Healthcare"),
    FINANCIALS("Financials"),
    CONSUMER("Consumer"),
    ENERGY("Energy"),
    INDUSTRIALS("Industrials"),
    UTILITIES("Utilities"),
    REAL_ESTATE("Real Estate");

    private String name;

    SectorType(String name) {
        this.name = name;
    }

    @JsonValue
    public String getName() {
        return name;
    }

}
