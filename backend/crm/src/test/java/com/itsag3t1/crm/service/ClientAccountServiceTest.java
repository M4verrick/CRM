package com.itsag3t1.crm.service;

import com.itsag3t1.crm.exception.DatabaseException;
import com.itsag3t1.crm.exception.InvalidDataException;
import com.itsag3t1.crm.exception.ResourceNotFoundException;
import com.itsag3t1.crm.model.ClientAccount;
import com.itsag3t1.crm.repository.ClientAccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ClientAccountServiceTest {

    @Mock
    private ClientAccountRepository accountRepository;

    @InjectMocks
    private ClientAccountService accountService;

    @BeforeEach
    void setUp() {
        // Initializes the mocks before each test
        MockitoAnnotations.openMocks(this);
    }

    private ClientAccount createAccount(Long clientId, ClientAccount.AccountType accountType, ClientAccount.AccountStatus accountStatus, String currency, String branchId, Double initialDeposit) {
        ClientAccount account = new ClientAccount();
        account.setClientId(clientId);
        account.setAccountType(accountType);
        account.setAccountStatus(accountStatus);
        account.setCurrency(currency);
        account.setBranchId(branchId);
        account.setInitialDeposit(initialDeposit);
        return account;
    }

    @Test
    void testCreateAccount_WithValidData() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, "SGD", "B001", 0.0);
        when(accountRepository.save(any(ClientAccount.class))).thenReturn(account);

        // Adding agentId to the service method call
        String agentId = "AGENT123";
        ClientAccount createdAccount = accountService.createAccount(account, agentId);

        assertNotNull(createdAccount);
        assertEquals(account.getClientId(), createdAccount.getClientId());
        verify(accountRepository, times(1)).save(account);
    }

    @Test
    void testCreateAccount_WithNullInitialDeposit() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, "SGD", "B001", null);

        // Adding agentId to the service method call
        String agentId = "AGENT123";
        ClientAccount createdAccount = accountService.createAccount(account, agentId);

        assertNotNull(createdAccount);
        assertEquals(0.0, createdAccount.getInitialDeposit());
    }

    @Test
    void testCreateAccount_WithNullClientId() {
        ClientAccount account = createAccount(null, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, "SGD", "B001", null);

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            // Adding agentId to the service method call
            String agentId = "AGENT123";
            accountService.createAccount(account, agentId);
        });

        assertEquals("Client ID must not be null", exception.getMessage());
    }

    @Test
    void testCreateAccount_WithNullAccountType() {
        ClientAccount account = createAccount(1L, null, ClientAccount.AccountStatus.ACTIVE, "SGD", "B001", null);

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            // Adding agentId to the service method call
            String agentId = "AGENT123";
            accountService.createAccount(account, agentId);
        });

        assertEquals("Account type must not be null", exception.getMessage());
    }

    @Test
    void testCreateAccount_WithNullAccountStatus() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, null, "SGD", "B001", null);

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            // Adding agentId to the service method call
            String agentId = "AGENT123";
            accountService.createAccount(account, agentId);
        });

        assertEquals("Account status must not be null", exception.getMessage());
    }

    @Test
    void testCreateAccount_WithNullCurrency() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, null, "B001", null);

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            // Adding agentId to the service method call
            String agentId = "AGENT123";
            accountService.createAccount(account, agentId);
        });

        assertEquals("Currency must not be null", exception.getMessage());
    }

    @Test
    void testCreateAccount_WithNullBranchId() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, "SGD", null, null);

        InvalidDataException exception = assertThrows(InvalidDataException.class, () -> {
            // Adding agentId to the service method call
            String agentId = "AGENT123";
            accountService.createAccount(account, agentId);
        });

        assertEquals("Branch ID must not be null", exception.getMessage());
    }

    @Test
    void testDeleteAccount_Success() {
        ClientAccount account = new ClientAccount();
        account.setAccountId(1L);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(account));

        // Adding agentId to the service method call
        String agentId = "AGENT123";
        boolean isDeleted = accountService.deleteAccount(1L, agentId);

        assertTrue(isDeleted);
        verify(accountRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteAccount_NotFound() {
        when(accountRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            // Adding agentId to the service method call
            String agentId = "AGENT123";
            accountService.deleteAccount(1L, agentId);
        });

        assertEquals("Account not found with ID: 1", exception.getMessage());
    }

    @Test
    void testCreateAccount_DatabaseError() {
        ClientAccount account = createAccount(1L, ClientAccount.AccountType.SAVINGS, ClientAccount.AccountStatus.ACTIVE, "SGD", "B001", 0.0);

        // Mocking the save method to throw a DataAccessException
        when(accountRepository.save(any(ClientAccount.class))).thenThrow(new DataAccessException("Database error") {
        });

        DatabaseException exception = assertThrows(DatabaseException.class, () -> {
            // Adding agentId to the service method call
            String agentId = "AGENT123";
            accountService.createAccount(account, agentId);
        });

        assertEquals("An error occurred while saving the account: Database error", exception.getMessage());
    }
}
