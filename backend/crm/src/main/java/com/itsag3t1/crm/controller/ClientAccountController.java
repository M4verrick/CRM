package com.itsag3t1.crm.controller;

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

    @PostMapping
    public ResponseEntity<ClientAccount> createAccount(@RequestBody ClientAccount account) {
        // Convert account type and status to uppercase if they are received as lowercase
        if (account.getAccountType() != null) {
            account.setAccountType(ClientAccount.AccountType.valueOf(account.getAccountType().toString().toUpperCase()));
        }
        if (account.getAccountStatus() != null) {
            account.setAccountStatus(ClientAccount.AccountStatus.valueOf(account.getAccountStatus().toString().toUpperCase()));
        }

        // Create the account
        ClientAccount createdAccount = accountService.createAccount(account);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }


    @DeleteMapping("/{accountId}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long accountId) {
        boolean isDeleted = accountService.deleteAccount(accountId);
        return isDeleted 
            ? ResponseEntity.noContent().build()  // 204 No Content for successful deletion
            : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found.");  // 404 Not Found
    }
}
