    package com.itsag3t1.crm.model;
    import jakarta.persistence.*;
    import java.io.Serializable;

    @Entity
    @Table(name = "agent_profile",
        uniqueConstraints = {@UniqueConstraint(columnNames = "client_id")}) // Ensures each client has only one agent
    public class AgentProfile implements Serializable {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private Long id;

        @Column(name = "agent_id", nullable = false)
        private String agentId;

        @OneToOne
        @JoinColumn(name = "client_id", referencedColumnName = "id", nullable = false, unique = true) // Enforces one agent per client
        private Profile client;

        public String getAgentId() {
            return agentId;
        }

        public void setAgentId(String agentId) {
            this.agentId = agentId;
        }

        public Profile getClient() {
            return client;
        }

        public void setClient(Profile client) {
            this.client = client;
        }
        
    }
