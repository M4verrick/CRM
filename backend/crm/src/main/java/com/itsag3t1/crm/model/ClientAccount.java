package com.itsag3t1.crm.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.itsag3t1.crm.exception.InvalidDataException;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

//@Getter
//@Setter
@Entity
@Table(name = "client_accounts")
public class ClientAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

    @Setter
    @Getter
    @NotNull(message = "Profile must not be null")
    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false)
    @JsonBackReference
    private Profile profile;

    @Getter
    @Setter
    @NotNull(message = "Account type must not be null")
    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;

    @Getter
    @Setter
    @NotNull(message = "Account status must not be null")
    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private AccountStatus accountStatus;

    @Getter
    @Setter
    @Temporal(TemporalType.DATE)
    @Column(name = "opening_date")
    private Date openingDate;

    @Setter
    @Getter
    @NotNull(message = "Currency must not be null")
    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Setter
    @Getter
    @NotNull(message = "Branch ID must not be null")
    @Column(name = "branch_id", nullable = false, length = 10)
    private String branchId;

    @Getter
    @Min(value = 0, message = "Initial deposit must be 0 or higher")
    @Column(name = "initial_deposit", nullable = false)
    private Double initialDeposit;

    // No-arg constructor for JPA
    public ClientAccount() {
    }

    // Constructor to initialize fields
    public ClientAccount(Profile profile, AccountType accountType, AccountStatus accountStatus, String currency, String branchId, Double initialDeposit) {
        this.profile = profile;
        this.accountType = accountType;
        this.accountStatus = accountStatus;
        this.openingDate = new Date();
        this.currency = currency;
        this.branchId = branchId;
        this.initialDeposit = initialDeposit;
    }

    // Getters and setters
    public Long getClientId() {
        return accountId;
    }

    public void setInitialDeposit(Double initialDeposit) {
        if (initialDeposit == null) {
            throw new InvalidDataException("Initial deposit must not be null.");
        }
        this.initialDeposit = initialDeposit;
    }

    // Enums
    public enum AccountType {
        SAVINGS,
        CHECKING,
        BUSINESS
    }

    public enum AccountStatus {
        ACTIVE,
        INACTIVE,
        PENDING
    }
}
