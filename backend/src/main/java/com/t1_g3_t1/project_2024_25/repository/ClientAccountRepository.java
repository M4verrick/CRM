package com.t1_g3_t1.project_2024_25.repository;

import com.t1_g3_t1.project_2024_25.classes.ClientAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientAccountRepository extends JpaRepository<ClientAccount, Long> {
    // Optional: Add more methods
}
