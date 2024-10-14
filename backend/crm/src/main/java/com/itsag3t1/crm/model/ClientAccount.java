package com.itsag3t1.crm.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.Date;

@Entity
@Table(name = "client_accounts") // Define the table name
public class ClientAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "account_id") // Define column name
    private Long accountId;

    @NotNull(message = "Client ID must not be null")
    @Column(name = "client_id", nullable = false) // Define column name and make it not nullable
    private Long clientId;

    @NotNull(message = "Account type must not be null")
    @Pattern(regexp = "savings|checking|business", message = "Account type must be one of: savings, checking, business")
    @Column(name = "account_type", nullable = false, length = 20) // Define column name and length
    private String accountType;

    @NotNull(message = "Account status must not be null")
    @Pattern(regexp = "active|inactive|pending", message = "Account status must be one of: active, inactive, pending")
    @Column(name = "account_status", nullable = false, length = 20) // Define column name and length
    private String accountStatus;

    @Temporal(TemporalType.DATE)
    @Column(name = "opening_date") // Define column name
    private Date openingDate;

    @NotNull(message = "Currency must not be null")
    @Column(name = "currency", nullable = false, length = 3) // Define column name, and restrict length to currency code length
    private String currency;

    @NotNull(message = "Branch ID must not be null")
    @Column(name = "branch_id", nullable = false, length = 10) // Define column name
    private String branchId;

    @Min(value = 0, message = "Initial deposit must be 0 or higher")
    @Column(name = "initial_deposit", nullable = false) // Define column name
    private Double initialDeposit;

    // No-arg constructor for JPA
    public ClientAccount() {
    }

    // Constructor for setting default initialDeposit if null
    public ClientAccount(Long clientId, String accountType, String accountStatus, Date openingDate,
                         Double initialDeposit, String currency, String branchId) {
        this.clientId = clientId;
        this.accountType = accountType;
        this.accountStatus = accountStatus;
        this.openingDate = openingDate;
        this.initialDeposit = initialDeposit == null ? 0.0 : initialDeposit;
        this.currency = currency;
        this.branchId = branchId;
    }

    // Getters and setters

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

    public Date getOpeningDate() {
        return openingDate;
    }

    public void setOpeningDate(Date openingDate) {
        this.openingDate = openingDate;
    }

    public Double getInitialDeposit() {
        return initialDeposit;
    }

    public void setInitialDeposit(Double initialDeposit) {
        this.initialDeposit = initialDeposit == null ? 0.0 : initialDeposit;
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
}
