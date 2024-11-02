package com.itsag3t1.crm.repository;

import com.itsag3t1.crm.model.AgentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgentProfileRepository extends JpaRepository<AgentProfile, Long> {
    boolean existsByAgentIdAndProfileId(String agentId, Long clientId);
    Optional<AgentProfile> findByAgentId(String agentId);
    List<AgentProfile> findAllByAgentId(String agentId);
    Optional<AgentProfile> findByAgentIdAndProfileId(String agentId, Long clientId);
}