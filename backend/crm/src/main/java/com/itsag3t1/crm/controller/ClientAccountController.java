package com.itsag3t1.crm.controller;

import com.itsag3t1.crm.model.ClientAccount;
import com.itsag3t1.crm.service.ClientAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
public class ClientAccountController {
    @Autowired
    private ClientAccountService accountService;

    @PostMapping
    public ResponseEntity<ClientAccount> createAccount(@RequestBody ClientAccount account) {
        ClientAccount createdAccount = accountService.createAccount(account);
        return ResponseEntity.ok(createdAccount);
    }

    @DeleteMapping("/{accountId}")
    public ResponseEntity<String> deleteAccount(@PathVariable Long accountId) {
        boolean isDeleted = accountService.deleteAccount(accountId);
        return isDeleted ? ResponseEntity.ok("Account deleted.") : ResponseEntity.status(404).body("Account not found.");
    }
}
