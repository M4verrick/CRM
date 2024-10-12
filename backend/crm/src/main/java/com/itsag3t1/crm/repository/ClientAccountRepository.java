package com.itsag3t1.crm.repository;

import com.itsag3t1.crm.model.ClientAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientAccountRepository extends JpaRepository<ClientAccount, Long> {
    // Optional: Add more methods
}
