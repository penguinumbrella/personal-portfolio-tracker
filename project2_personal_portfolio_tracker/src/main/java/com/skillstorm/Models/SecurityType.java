package com.skillstorm.Models;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SecurityType {
    STOCK("Stock"),
    ETF("ETF"),
    MUTUAL_FUND("Mutual Fund"),
    BOND("Bond");

    private String name;

    SecurityType(String name) {
        this.name = name;
    }

    @JsonValue
    public String getName() {
        return name;
    }
}
