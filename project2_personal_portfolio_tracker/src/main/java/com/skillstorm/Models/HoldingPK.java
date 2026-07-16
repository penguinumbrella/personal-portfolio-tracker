package com.skillstorm.Models;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * Composite primary key for {@link Holding}, pairing an investment account with a security.
 *
 * <p>Spring JPA requires composite primary keys to be stored in a public serializable class that:
 * <ul>
 *   <li>is annotated {@code @Embeddable} here and referenced via {@code @EmbeddedId} on the entity</li>
 *   <li>declares both an empty and a full constructor</li>
 *   <li>maps each field with {@code @MapsId("fieldName")} alongside the corresponding {@code @ManyToOne}</li>
 *   <li>overrides {@link #equals(Object)} and {@link #hashCode()}</li>
 * </ul>
 * A record would fit this role, but isn't supported by older versions of Java.
 */
@Embeddable
public class HoldingPK implements Serializable {

    @Column(name = "account_id", nullable = false)
    private int accountId;

    @Column(name = "security_id", nullable = false)
    private int securityId;

    public HoldingPK() {
    }

    public HoldingPK(int accountId, int securityId) {
        this.accountId = accountId;
        this.securityId = securityId;
    }

    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int accountId) {
        this.accountId = accountId;
    }

    public int getSecurityId() {
        return securityId;
    }

    public void setSecurityId(int securityId) {
        this.securityId = securityId;
    }

    /**
     * Compares this key to another by account id and security id. JPA relies on this to
     * locate entities within the persistence context.
     *
     * @param obj the object to compare against
     * @return {@code true} if {@code obj} is a {@link HoldingPK} with the same account and security ids
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (!(obj instanceof HoldingPK) || this == null)
            return false;
        HoldingPK tempPK = (HoldingPK) obj;
        if (tempPK.accountId == this.accountId && tempPK.securityId == this.securityId)
            return true;

        return false;
    }

    /**
     * Combines the account id and security id into a single hash.
     *
     * @return the hash code for this key
     */
    @Override
    public int hashCode() {
        return Objects.hash(accountId, securityId);
    }
}
