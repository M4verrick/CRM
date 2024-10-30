    package com.itsag3t1.crm.model;
    import jakarta.persistence.*;
    import lombok.Getter;
    import lombok.Setter;

    import java.io.Serializable;

    @Getter
    @Setter
    @Entity
    @Table(name = "agent_profile",
        uniqueConstraints = {@UniqueConstraint(columnNames = "profile_id")}) // Ensures each client has only one agent
    public class AgentProfile implements Serializable {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private Long id;

        @Column(name = "agent_id", nullable = false)
        private String agentId;

        @OneToOne
        @JoinColumn(name = "profile_id", referencedColumnName = "id", nullable = false, unique = true) // Enforces one agent per client
        private Profile profile;

        
    }
