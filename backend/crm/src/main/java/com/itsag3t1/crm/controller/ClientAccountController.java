package com.itsag3t1.crm.controller;

//import com.itsag3t1.crm.auth.CurrentAuthContext;

import com.itsag3t1.crm.model.ClientAccount;
import com.itsag3t1.crm.service.ClientAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
public class ClientAccountController {
    @Autowired
    private ClientAccountService accountService;

    // Adding the AgentID as a request header for account creation
    @PostMapping
    public ResponseEntity<ClientAccount> createAccount(@RequestBody ClientAccount account) {
//        String agentId = CurrentAuthContext.getUserId();
        String agentId = "agent123";

        // Convert account type and status to uppercase if they are received as lowercase
        if (account.getAccountType() != null) {
            account.setAccountType(ClientAccount.AccountType.valueOf(account.getAccountType().toString().toUpperCase()));
        }
        if (account.getAccountStatus() != null) {
            account.setAccountStatus(ClientAccount.AccountStatus.valueOf(account.getAccountStatus().toString().toUpperCase()));
        }

        // Pass AgentID to the service for logging
        ClientAccount createdAccount = accountService.createAccount(account, agentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }

    // Adding the AgentID as a request header for account deletion
    @DeleteMapping("/{accountId}")
    public ResponseEntity<String> deleteAccount(
            @RequestHeader("AgentID") String agentId, // AgentID from request header
            @PathVariable Long accountId) {

        boolean isDeleted = accountService.deleteAccount(accountId, agentId);
        return isDeleted
                ? ResponseEntity.noContent().build()  // 204 No Content for successful deletion
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found.");  // 404 Not Found
    }
}
