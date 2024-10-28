package com.itsag3t1.crm.repository;

import com.itsag3t1.crm.model.AgentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgentProfileRepository extends JpaRepository<AgentProfile, Long> {
    boolean existsByAgentIdAndClientId(String agentId, Long clientId);
}