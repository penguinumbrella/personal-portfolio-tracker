package com.skillstorm.Models;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SectorType {
    STOCK("Stock"),
    ETF("ETF"),
    MUTUAL_FUND("Mutual Fund"),
    BOND("Bond");

    private String name;

    SectorType(String name) {
        this.name = name;
    }

    @JsonValue
    public String getName() {
        return name;
    }
}
