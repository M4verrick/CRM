package com.itsag3t1.crm.repository;

import com.itsag3t1.crm.model.Profile;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByVerificationToken(String token);

    // @Query("SELECT p FROM Profile p WHERE p.agentProfile.agentId = :agentId AND p.id = :id")
    // Optional<Profile> findByIdAndAgentProfile_AgentId(@Param("id") Long id, @Param("agentId") String agentId);

    // @Query("SELECT p FROM Profile p WHERE p.agentProfile.agentId = :agentId")
    // List<Profile> findByAgentProfile_AgentId(@Param("agentId") String agentId);

    @EntityGraph(attributePaths = {"clientAccounts"})
    @Query("SELECT p FROM Profile p WHERE p.id IN :ids")
    List<Profile> findAllWithClientAccountsByIdIn(@Param("ids") List<Long> ids);

}