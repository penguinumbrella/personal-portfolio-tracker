package com.skillstorm.DTOs;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public record PortfolioValuePointDto(
		@JsonFormat(pattern = "yyyy-MM-dd") Date date,
		long value) {

}
