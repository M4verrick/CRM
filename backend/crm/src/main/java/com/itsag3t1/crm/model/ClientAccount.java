package com.itsag3t1.crm.model;

import com.itsag3t1.crm.exception.InvalidDataException;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

@Entity
@Table(name = "client_accounts")
public class ClientAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id")
    private Long accountId;
    @NotNull(message = "Client ID must not be null")
    @Column(name = "client_id", nullable = false)
    private Long clientId;
    @NotNull(message = "Account type must not be null")
    @Enumerated(EnumType.STRING) // Store as string in the database
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;
    @NotNull(message = "Account status must not be null")
    @Enumerated(EnumType.STRING) // Store as string in the database
    @Column(name = "account_status", nullable = false)
    private AccountStatus accountStatus;
    @Temporal(TemporalType.DATE)
    @Column(name = "opening_date")
    private Date openingDate;
    @NotNull(message = "Currency must not be null")
    @Column(name = "currency", nullable = false, length = 3)
    private String currency;
    @NotNull(message = "Branch ID must not be null")
    @Column(name = "branch_id", nullable = false, length = 10)
    private String branchId;
    @Min(value = 0, message = "Initial deposit must be 0 or higher")
    @Column(name = "initial_deposit", nullable = false)
    private Double initialDeposit;

    // No-arg constructor for JPA
    public ClientAccount() {
    }

    // Constructor for accepting String and converting it to enum
    private ClientAccount createAccount(Long clientId, AccountType accountType, AccountStatus accountStatus, String currency, String branchId, Double initialDeposit) {
        ClientAccount account = new ClientAccount();
        account.setClientId(clientId);
        account.setAccountType(accountType);
        account.setAccountStatus(accountStatus);
        account.setCurrency(currency);
        account.setBranchId(branchId);
        account.setInitialDeposit(initialDeposit);
        return account;
    }


    // Getters and setters
    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public Date getOpeningDate() {
        return openingDate;
    }

    public void setOpeningDate(Date openingDate) {
        this.openingDate = openingDate;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getBranchId() {
        return branchId;
    }

    public void setBranchId(String branchId) {
        this.branchId = branchId;
    }

    public Double getInitialDeposit() {
        return initialDeposit;
    }


    public void setInitialDeposit(Double initialDeposit) {
        if (initialDeposit == null) {
            throw new InvalidDataException("Initial deposit must not be null.");
        }
        this.initialDeposit = initialDeposit;
    }

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
