/**
 * Entity to represent rows in Security table as Java objects
 */

package com.skillstorm.Models;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "security", schema = "portfolio")
public class Security {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "ticker_symbol", nullable = false)
    private String tickerSymbol;

    @Column(name = "security_name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "sector", nullable = false)
    private SectorType sector;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "security_type", nullable = false)
    private SecurityType type;

    @Column(name = "general_notes")
    private String generalNotes;

    @ManyToOne
    @JsonIgnoreProperties(value = { "securities", "investmentAccounts", "holdings" })
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    // --- Mappings ---
    /**
     * Security is many-to-many with Accounts
     * Join table via Holding
     * One Security has many Holdings
     */
    @OneToMany(mappedBy = "security", fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "security" })
    private List<Holding> holdings;

    public Security() {
    }

    public Security(int id, String tickerSymbol, String name, SectorType sector, SecurityType type,
            String generalNotes, User user) {
        this.id = id;
        this.tickerSymbol = tickerSymbol;
        this.name = name;
        this.sector = sector;
        this.type = type;
        this.generalNotes = generalNotes;
        this.user = user;
        this.holdings = new ArrayList<Holding>();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTickerSymbol() {
        return tickerSymbol;
    }

    public void setTickerSymbol(String tickerSymbol) {
        this.tickerSymbol = tickerSymbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SectorType getSector() {
        return sector;
    }

    public void setSector(SectorType sector) {
        this.sector = sector;
    }

    public SecurityType getType() {
        return type;
    }

    public void setType(SecurityType type) {
        this.type = type;
    }

    public String getGeneralNotes() {
        return generalNotes;
    }

    public void setGeneralNotes(String generalNotes) {
        this.generalNotes = generalNotes;
    }

    public List<Holding> getHoldings() {
        return holdings;
    }

    public void setHoldings(List<Holding> holdings) {
        this.holdings = holdings;
    }

    public User getUser() {
        return user;
    }

    public void setUserId(User user) {
        this.user = user;
    }

}