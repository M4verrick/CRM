package com.itsag3t1.crm.repository;

import com.itsag3t1.crm.model.ClientAccount;
import com.itsag3t1.crm.model.ClientAccount.AccountStatus;
import com.itsag3t1.crm.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientAccountRepository extends JpaRepository<ClientAccount, Long> {

    @Query("SELECT COUNT(c) FROM ClientAccount c WHERE c.profile.id = :profileId AND c.accountStatus = :accountStatus")
    long countActiveAccountsByProfileId(@Param("profileId") Long profileId, @Param("accountStatus") AccountStatus accountStatus);

    List<ClientAccount> findByProfile(Profile profile);
}
