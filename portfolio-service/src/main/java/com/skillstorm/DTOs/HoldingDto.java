package com.skillstorm.DTOs;

import java.sql.Date;

public record HoldingDto(int a_id, int s_id, int shares, int costPerShare, Date purchaseDate) {

}
