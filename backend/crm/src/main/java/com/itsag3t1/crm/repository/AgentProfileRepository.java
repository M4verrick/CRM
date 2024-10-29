package com.itsag3t1.crm.repository;

import com.itsag3t1.crm.model.AgentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgentProfileRepository extends JpaRepository<AgentProfile, Long> {
    boolean existsByAgentIdAndProfile_Id(String agentId, Long clientId);
    Optional<AgentProfile> findByAgentId(String agentId);
}