package com.itsag3t1.crm.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itsag3t1.crm.model.ClientAccount;
import com.itsag3t1.crm.model.Profile;
import com.itsag3t1.crm.service.ClientAccountService;
import com.itsag3t1.crm.util.ClaimsUtil;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf; // Import csrf()
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClientAccountController.class)
public class ClientAccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ClientAccountService accountService;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Test the GET /api/accounts/all endpoint.
     * This test checks if all client accounts are retrieved successfully.
     */
    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testGetAllClientAccounts() throws Exception {
        // Prepare mock data
        Profile profile = new Profile();
        profile.setId(1L);
        profile.setFirstName("John");
        profile.setLastName("Doe");
        // Set other required fields for Profile if necessary

        ClientAccount account1 = new ClientAccount();
        account1.setAccountId(1L);
        account1.setProfile(profile);
        account1.setAccountType(ClientAccount.AccountType.SAVINGS);
        account1.setAccountStatus(ClientAccount.AccountStatus.ACTIVE);
        account1.setCurrency("USD");
        account1.setBranchId("BR001");
        account1.setInitialDeposit(BigDecimal.valueOf(1000.00));
        account1.setOpeningDate(new Date());

        ClientAccount account2 = new ClientAccount();
        account2.setAccountId(2L);
        account2.setProfile(profile);
        account2.setAccountType(ClientAccount.AccountType.CHECKING);
        account2.setAccountStatus(ClientAccount.AccountStatus.ACTIVE);
        account2.setCurrency("USD");
        account2.setBranchId("BR002");
        account2.setInitialDeposit(BigDecimal.valueOf(500.00));
        account2.setOpeningDate(new Date());

        List<ClientAccount> clientAccounts = Arrays.asList(account1, account2);

        // Mock the service
        when(accountService.getAllClientAccounts()).thenReturn(clientAccounts);

        // Perform the GET request
        mockMvc.perform(get("/api/accounts/all")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                // Verify the response content
                .andExpect(jsonPath("$[0].accountId").value(1L))
                .andExpect(jsonPath("$[0].accountType").value("SAVINGS"))
                .andExpect(jsonPath("$[0].currency").value("USD"))
                .andExpect(jsonPath("$[1].accountId").value(2L))
                .andExpect(jsonPath("$[1].accountType").value("CHECKING"));
    }

    /**
     * Test the POST /api/accounts endpoint.
     * This test checks if a client account is created successfully.
     */
    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testCreateAccount() throws Exception {
        String agentId = "agent123";

        // Prepare the input account data
        Profile profile = new Profile();
        profile.setId(1L);

        ClientAccount account = new ClientAccount();
        account.setProfile(profile);
        account.setAccountType(ClientAccount.AccountType.SAVINGS);
        account.setAccountStatus(ClientAccount.AccountStatus.ACTIVE);
        account.setCurrency("USD");
        account.setBranchId("BR001");
        account.setInitialDeposit(BigDecimal.valueOf(1000.00));

        // Prepare the saved account data
        ClientAccount savedAccount = new ClientAccount();
        savedAccount.setAccountId(1L);
        savedAccount.setProfile(profile);
        savedAccount.setAccountType(ClientAccount.AccountType.SAVINGS);
        savedAccount.setAccountStatus(ClientAccount.AccountStatus.ACTIVE);
        savedAccount.setCurrency("USD");
        savedAccount.setBranchId("BR001");
        savedAccount.setInitialDeposit(BigDecimal.valueOf(1000.00));
        savedAccount.setOpeningDate(new Date());

        // Mock the static method ClaimsUtil.getAgentId()
        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);

            // Mock the service method
            when(accountService.createAccount(any(ClientAccount.class), eq(agentId))).thenReturn(savedAccount);

            String accountJson = objectMapper.writeValueAsString(account);

            // Perform the POST request
            mockMvc.perform(post("/api/accounts")
                            .with(csrf()) // Include CSRF token for POST request
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(accountJson))
                    .andExpect(status().isCreated())
                    // Verify the response content
                    .andExpect(jsonPath("$.accountId").value(1L))
                    .andExpect(jsonPath("$.accountType").value("SAVINGS"))
                    .andExpect(jsonPath("$.currency").value("USD"));
        }
    }

    /**
     * Test the DELETE /api/accounts/{accountId} endpoint for successful deletion.
     * This test checks if a client account is deleted successfully.
     */
    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testDeleteAccount_Success() throws Exception {
        String agentId = "agent123";
        Long accountId = 1L;

        // Mock the static method ClaimsUtil.getAgentId()
        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);

            // Mock the service method to return true (account deleted successfully)
            when(accountService.deleteAccount(accountId, agentId)).thenReturn(true);

            // Perform the DELETE request
            mockMvc.perform(delete("/api/accounts/{accountId}", accountId)
                            .with(csrf())) // Include CSRF token for DELETE request
                    .andExpect(status().isNoContent()); // Expect 204 No Content
        }
    }

    /**
     * Test the DELETE /api/accounts/{accountId} endpoint when account is not found.
     * This test checks if a 404 Not Found status is returned when the account doesn't exist.
     */
    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testDeleteAccount_NotFound() throws Exception {
        String agentId = "agent123";
        Long accountId = 1L;

        // Mock the static method ClaimsUtil.getAgentId()
        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);

            // Mock the service method to return false (account not found)
            when(accountService.deleteAccount(accountId, agentId)).thenReturn(false);

            // Perform the DELETE request
            mockMvc.perform(delete("/api/accounts/{accountId}", accountId)
                            .with(csrf())) // Include CSRF token for DELETE request
                    .andExpect(status().isNotFound()) // Expect 404 Not Found
                    .andExpect(content().string("Account not found."));
        }
    }
}
