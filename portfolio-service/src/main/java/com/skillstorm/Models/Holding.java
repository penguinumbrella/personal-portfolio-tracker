package com.skillstorm.Models;

import java.sql.Date;

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

/** Entity representing a row in the {@code holding} table: a position in a security held by an investment account. */
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "holding", schema = "portfolio")
public class Holding {

    /** Composite key pairing the account and security this holding belongs to. */
    @EmbeddedId
    private HoldingPK id;

    @Column(name = "num_shares", nullable = false)
    private int shares;

    @Column(name = "cost_per_share", nullable = false)
    private int costPerShare;

    @Column(name = "purchase_date", nullable = false)
    private Date purchaseDate;

    // --- Mappings ---
    /** The account this holding belongs to; maps to {@link HoldingPK#getAccountId()}. */
    @MapsId("accountId")
    @ManyToOne
    @JsonIgnoreProperties(value = { "holdings" })
    @JoinColumn(name = "account_id", referencedColumnName = "id")
    private InvestmentAccount account;

    /** The security this holding is a position in; maps to {@link HoldingPK#getSecurityId()}. */
    @MapsId("securityId")
    @ManyToOne
    @JoinColumn(name = "security_id", referencedColumnName = "id")
    @JsonIgnoreProperties(value = { "holdings" })
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
