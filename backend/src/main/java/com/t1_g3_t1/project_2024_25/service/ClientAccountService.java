package com.t1_g3_t1.project_2024_25.service;

import com.t1_g3_t1.project_2024_25.classes.ClientAccount;
import com.t1_g3_t1.project_2024_25.repository.ClientAccountRepository;
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
