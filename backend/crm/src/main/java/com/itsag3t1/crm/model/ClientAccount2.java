package com.itsag3t1.crm.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.Date;

@Entity
public class ClientAccount2 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @NotNull(message = "Client ID must not be null")
    private Long clientId;

    @NotNull(message = "Account type must not be null")
    @Pattern(regexp = "savings|checking|business", message = "Account type must be one of: savings, checking, business")
    private String accountType;

    @NotNull(message = "Account status must not be null")
    @Pattern(regexp = "active|inactive|pending", message = "Account status must be one of: active, inactive, pending")
    private String accountStatus;

    @Temporal(TemporalType.DATE)
    private Date openingDate;

    @NotNull(message = "Currency must not be null")
    private String currency;

    @NotNull(message = "Branch ID must not be null")
    private String branchId;

    @Min(value = 0, message = "Initial deposit must be 0 or higher")
    private Double initialDeposit;


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
