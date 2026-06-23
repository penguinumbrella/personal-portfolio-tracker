package com.skillstorm.Models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password-hash", nullable = false)
    private String passwordHash;

    @OneToMany(mappedBy = "user")
    @JsonIgnoreProperties(value = {"user"})
    private List<InvestmentAccount> investmentAccounts;

    public User() {
    }

    public User(int id, String username, String email, String passwordHash,
            List<InvestmentAccount> investmentAccounts) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.investmentAccounts = investmentAccounts;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public List<InvestmentAccount> getInvestmentAccounts() {
        return investmentAccounts;
    }

    public void setInvestmentAccounts(List<InvestmentAccount> investmentAccounts) {
        this.investmentAccounts = investmentAccounts;
    }

    
    
    
}
