package com.itsag3t1.crm.repository;

import com.itsag3t1.crm.model.ClientAccount;
import com.itsag3t1.crm.model.ClientAccount.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientAccountRepository extends JpaRepository<ClientAccount, Long> {

    @Query("SELECT COUNT(c) FROM ClientAccount c WHERE c.profileId = :profileId AND c.accountStatus = :status")
    long countActiveAccountsByProfileId(@Param("profileId") Long profileId, @Param("status") AccountStatus status);
}
