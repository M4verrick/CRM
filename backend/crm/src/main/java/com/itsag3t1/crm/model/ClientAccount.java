package com.itsag3t1.crm.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.itsag3t1.crm.exception.InvalidDataException;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "client_accounts")
public class ClientAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;

//    @NotNull(message = "Profile must not be null")
//    @JoinColumn(name = "profile_id",nullable = false)
//    private Long profileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    @JsonBackReference
    private Profile profile;

    @NotNull(message = "Account type must not be null")
    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;

    @NotNull(message = "Account status must not be null")
    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private AccountStatus accountStatus;

    @Temporal(TemporalType.DATE)
    @Column(name = "opening_date", nullable = false)
    private Date openingDate = new Date();

    @NotNull(message = "Currency must not be null")
    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @NotNull(message = "Branch ID must not be null")
    @Column(name = "branch_id", nullable = false, length = 10)
    private String branchId;

    @Min(value = 0, message = "Initial deposit must be 0 or higher")
    @NotNull(message = "Initial deposit must not be null")
    @Column(name = "initial_deposit", nullable = false, precision = 15, scale = 2)
    private BigDecimal initialDeposit;

    // No-arg constructor for JPA
    public ClientAccount() {
    }

    // Constructor to initialize fields
    public ClientAccount(Profile profile, AccountType accountType, AccountStatus accountStatus, String currency, String branchId, BigDecimal initialDeposit) {
        this.profile = profile;
        this.accountType = accountType;
        this.accountStatus = accountStatus;
        this.currency = currency;
        this.branchId = branchId;
        this.initialDeposit = initialDeposit;
        this.openingDate = new Date();
    }

    // Custom setter for initialDeposit with validation
//    public void setInitialDeposit(Double initialDeposit) {
//        if (initialDeposit == null) {
//            throw new InvalidDataException("Initial deposit must not be null.");
//        }
//        this.initialDeposit = initialDeposit;
//    }

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
