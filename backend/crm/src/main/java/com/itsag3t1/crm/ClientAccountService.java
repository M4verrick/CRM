package com.itsag3t1.crm.service;

import com.itsag3t1.crm.model.ClientAccount;
import com.itsag3t1.crm.repository.ClientAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class ClientAccountService {
    @Autowired
    private ClientAccountRepository accountRepository;

    public ClientAccount createAccount(ClientAccount account) {
        account.setOpeningDate(new Date());  // Set current date for opening date
        return accountRepository.save(account);
    }

    public boolean deleteAccount(Long accountId) {
        Optional<ClientAccount> account = accountRepository.findById(accountId);
        if (account.isPresent()) {
            accountRepository.deleteById(accountId);
            return true;
        }
        return false;
    }
}
