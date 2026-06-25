package com.skillstorm.DTOs;

import java.util.List;

import com.skillstorm.Models.Holding;
import com.skillstorm.Models.SectorType;
import com.skillstorm.Models.SecurityType;
import com.skillstorm.Models.User;

public record SecurityDto(int id, String tickerSymbol, String name, SectorType sector, SecurityType type,
        String generalNotes, int userId) {
}
