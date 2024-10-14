package com.itsag3t1.crm.service;

import com.itsag3t1.crm.model.ClientAccount;
import com.itsag3t1.crm.repository.ClientAccountRepository;
import com.itsag3t1.crm.exception.InvalidDataException;
import com.itsag3t1.crm.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class ClientAccountService {
    @Autowired
    private ClientAccountRepository accountRepository;

    public ClientAccount createAccount(ClientAccount account) {
        if (account.getClientId() == null) {
            throw new InvalidDataException("Client ID must not be null");
        }
        if (account.getAccountType() == null || 
            (!account.getAccountType().equals("savings") && 
             !account.getAccountType().equals("checking") && 
             !account.getAccountType().equals("business"))) {
            throw new InvalidDataException("Account type must be one of: savings, checking, business");
        }
        if (account.getAccountStatus() == null || 
            (!account.getAccountStatus().equals("active") && 
             !account.getAccountStatus().equals("inactive") && 
             !account.getAccountStatus().equals("pending"))) {
            throw new InvalidDataException("Account status must be one of: active, inactive, pending");
        }
        if (account.getCurrency() == null) {
            throw new InvalidDataException("Currency must not be null");
        }
        if (account.getBranchId() == null) {
            throw new InvalidDataException("Branch ID must not be null");
        }

        // Set initial deposit to 0.0 if it's null
        if (account.getInitialDeposit() == null) {
            account.setInitialDeposit(0.0);
        }

        // Set current date for opening date
        account.setOpeningDate(new Date());

        try {
            return accountRepository.save(account);
        } catch (DataAccessException e) {
            throw new DatabaseException("An error occurred while saving the account: " + e.getMessage(), e);
        }
    }

    public boolean deleteAccount(Long accountId) {
        try {
            Optional<ClientAccount> account = accountRepository.findById(accountId);
            if (account.isPresent()) {
                accountRepository.deleteById(accountId);
                return true;
            }
            throw new ResourceNotFoundException("Account not found with ID: " + accountId);
        } catch (DataAccessException e) {
            throw new DatabaseException("An error occurred while deleting the account: " + e.getMessage(), e);
        }
    }
}
