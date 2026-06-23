package com.skillstorm.Models;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import com.skillstorm.Models.User;

@Entity
@Table(name = "investment_account")
public class InvestmentAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "nickname", nullable = false, unique = true)
    private String nickname;

    @Column(name = "account_type", nullable = false, unique = true)
    private InvestmentType accountType;

    @Column(name = "date_opened", nullable = false)
    private Date dateOpened;


    @ManyToOne
    @JsonIgnoreProperties(value = {"investmentAccounts"})
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;


    public InvestmentAccount() {
    }


    public InvestmentAccount(int id, String nickname, InvestmentType accountType, Date dateOpened, User user) {
        this.id = id;
        this.nickname = nickname;
        this.accountType = accountType;
        this.dateOpened = dateOpened;
        this.user = user;
    }


    public int getId() {
        return id;
    }


    public void setId(int id) {
        this.id = id;
    }


    public String getNickname() {
        return nickname;
    }


    public void setNickname(String nickname) {
        this.nickname = nickname;
    }


    public InvestmentType getAccountType() {
        return accountType;
    }


    public void setAccountType(InvestmentType accountType) {
        this.accountType = accountType;
    }


    public Date getDateOpened() {
        return dateOpened;
    }


    public void setDateOpened(Date dateOpened) {
        this.dateOpened = dateOpened;
    }


    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }

    
    
}
