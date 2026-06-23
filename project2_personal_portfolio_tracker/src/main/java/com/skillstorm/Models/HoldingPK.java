/**
 * Spring JPA requires composite primary keys to be stored in public serialized class
 * requires @Embeddable here and @EmbeddedId in the respective model/entity
 * requires empty and full constructors
 * requires @MapsId("fieldName") along with the @ManytoOne
 * requires equals() and hashCode() to be overridden
 * could use a record instead, but that isn't supported in older versions of java
 */

package com.skillstorm.Models;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

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
     * JPA uses equals and hashCode to find entity in the context
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
     * Create Hash of combined accountId and securityId
     */
    @Override
    public int hashCode() {
        return Objects.hash(accountId, securityId);
    }
}
