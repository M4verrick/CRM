package com.itsag3t1.crm.service;

import com.itsag3t1.crm.exception.DatabaseException;
import com.itsag3t1.crm.exception.InvalidDataException;
import com.itsag3t1.crm.exception.ResourceNotFoundException;
import com.itsag3t1.crm.model.ClientAccount;
import com.itsag3t1.crm.model.Profile;
import com.itsag3t1.crm.repository.ClientAccountRepository;
import com.itsag3t1.crm.repository.AgentProfileRepository;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ClientAccountService {
    private static final org.slf4j.Logger log = LoggerFactory.getLogger(ClientAccountService.class);

    // Assuming this format for ISO 8601 datetime
    private static final SimpleDateFormat ISO_8601_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
    @Autowired
    private ClientAccountRepository accountRepository;
    private AgentProfileRepository agentProfileRepository;

    public ClientAccount createAccount(ClientAccount account, String agentId) {
        validateAccountData(account);

        // Check if the clientId is associated with the agentId
        if (!isClientAssociatedWithAgent(account.getAccountId(), agentId)) {
            throw new InvalidDataException("Agent is not authorized to create an account for this client");
        }
        // Set initial deposit to 0.0 if it's null
        if (account.getInitialDeposit() == null) {
            account.setInitialDeposit(0.0);
        }

        // Set current date for opening date
        account.setOpeningDate(new Date());

        ClientAccount savedAccount;

        try {
            savedAccount = accountRepository.save(account);
            // Log the creation after the account is saved
            MDC.put("agent_id", agentId);
            MDC.put("client_id", savedAccount.getAccountId().toString());
            MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));

            log.info("{} created {} account at {}", MDC.get("agent_id"), MDC.get("client_id"), MDC.get("date_time"));

            return savedAccount;
        } catch (DataAccessException e) {
            throw new DatabaseException("An error occurred while saving the account: " + e.getMessage(), e);
        } finally {
            MDC.clear(); // Clear MDC after logging
        }
    }

    public List<ClientAccount> getAllClientAccounts() {
        return accountRepository.findAll();
    }

    public boolean deleteAccount(Long accountId, String agentId) {
        Optional<ClientAccount> account;
        // Check if the clientId is associated with the agentId
        try {
            account = accountRepository.findById(accountId);
            if (account.isPresent()) {
                if (!isClientAssociatedWithAgent(account.get().getAccountId(), agentId)) {
                    throw new InvalidDataException("Agent is not authorized to create an account for this client");
                }
                accountRepository.deleteById(accountId);
                // Log the deletion after the account is deleted
                MDC.put("agent_id", agentId);
                MDC.put("client_id", account.get().getAccountId().toString());
                MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));

                log.info("{} deleted {} account at {}", MDC.get("agent_id"), MDC.get("client_id"),
                        MDC.get("date_time"));

                return true;
            }
            throw new ResourceNotFoundException("Account not found with ID: " + accountId);
        } catch (DataAccessException e) {
            throw new DatabaseException("An error occurred while deleting the account: " + e.getMessage(), e);
        } finally {
            MDC.clear(); // Clear MDC after logging
        }
    }

    private void validateAccountData(ClientAccount account) {
        if (account.getAccountId() == null) {
            throw new InvalidDataException("Client ID must not be null");
        }
        if (account.getAccountType() == null) {
            throw new InvalidDataException("Account type must not be null");
        }
        if (account.getAccountStatus() == null) {
            throw new InvalidDataException("Account status must not be null");
        }
        if (account.getCurrency() == null) {
            throw new InvalidDataException("Currency must not be null");
        }
        if (account.getBranchId() == null) {
            throw new InvalidDataException("Branch ID must not be null");
        }
    }

    private boolean isClientAssociatedWithAgent(Long clientId, String agentId) {
        // Check if the clientId exists in the agent's profile mapping
        return agentProfileRepository.existsByAgentIdAndProfile_Id(agentId, clientId);
    }

}