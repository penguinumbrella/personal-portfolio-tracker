package com.skillstorm.Services;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.skillstorm.DTOs.InvestmentAccountDto;
import com.skillstorm.DTOs.UserDto;
import com.skillstorm.Models.InvestmentAccount;
import com.skillstorm.Models.InvestmentType;
import com.skillstorm.Models.User;
import com.skillstorm.Repositories.InvestmentAccountRepo;
import com.skillstorm.Repositories.UserRepo;

@ExtendWith(MockitoExtension.class)
public class InvestmentAccountServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private InvestmentAccountRepo investmentAccountRepo;

    @InjectMocks
    private UserService service;

    private User testUser;

    private InvestmentType testInvestmentType;

    private InvestmentAccount testInvestmentAccount;
    private InvestmentAccountDto testInvestmentAccountDto;

    @BeforeEach
    void dataInit() {
        testUser = new User(1, "plswork", "plswork@test.com", "hash");
        //testInvestmentAccount = new InvestmentAccount(1, "testname", testInvestmentAccount, new Date(), testUser, null);
    }

    
}
