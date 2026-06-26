package com.skillstorm.Models;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class, 
    property = "id"
)
@Table(name = "holding", schema = "portfolio")
public class Holding {

    // composite keys must be sorted in public serialized class
    @EmbeddedId
    private HoldingPK id;

    @Column(name = "num_shares", nullable = false)
    private int shares;

    @Column(name = "cost_per_share", nullable = false)
    private int costPerShare;

    @Column(name = "purchase_date", nullable = false)
    private Date purchaseDate;

    // --- Mappings ---
    @MapsId("accountId") // connects to accountId field in HoldingPK
    @ManyToOne
    @JsonIgnoreProperties(value = { "holdings" })
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    @JsonIgnore
    private InvestmentAccount account;

    @MapsId("securityId") // connects to securityId field in HoldingPK
    @ManyToOne
    @JoinColumn(name = "security_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = { "holdings" })
    @JsonIgnore
    private Security security;

    public Holding() {
    }

    public Holding(HoldingPK id, int shares, int costPerShare, Date purchaseDate, InvestmentAccount account,
            Security security) {
        this.id = id;
        this.shares = shares;
        this.costPerShare = costPerShare;
        this.purchaseDate = purchaseDate;
        this.account = account;
        this.security = security;
    }

    public HoldingPK getId() {
        return id;
    }

    public void setId(HoldingPK id) {
        this.id = id;
    }

    public int getShares() {
        return shares;
    }

    public void setShares(int shares) {
        this.shares = shares;
    }

    public int getCostPerShare() {
        return costPerShare;
    }

    public void setCostPerShare(int costPerShare) {
        this.costPerShare = costPerShare;
    }

    public Date getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(Date purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public InvestmentAccount getAccount() {
        return account;
    }

    public void setAccount(InvestmentAccount account) {
        this.account = account;
    }

    public Security getSecurity() {
        return security;
    }

    public void setSecurity(Security security) {
        this.security = security;
    }

}
