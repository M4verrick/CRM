package com.itsag3t1.crm.service;

import com.itsag3t1.crm.exception.DatabaseException;
import com.itsag3t1.crm.model.AgentProfile;
import com.itsag3t1.crm.model.ClientAccount;
import com.itsag3t1.crm.model.Profile;
import com.itsag3t1.crm.model.ProfileAccountsDTO;
import com.itsag3t1.crm.repository.AgentProfileRepository;
import com.itsag3t1.crm.repository.ClientAccountRepository;
import com.itsag3t1.crm.repository.ProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProfileService {
    private static final SimpleDateFormat ISO_8601_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
    private final Logger log = LoggerFactory.getLogger(ProfileService.class);
    private final ProfileRepository profileRepository;
    private final ClientAccountRepository clientAccountRepository;
    private final AgentProfileRepository agentProfileRepository;

    @Autowired
    public ProfileService(ProfileRepository profileRepository, ClientAccountRepository clientAccountRepository,
                          AgentProfileRepository agentProfileRepository) {
        this.profileRepository = profileRepository;
        this.clientAccountRepository = clientAccountRepository;
        this.agentProfileRepository = agentProfileRepository;
    }

    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    public List<Profile> getAllProfilesByAgentId(String agentId) {
        try {
            List<Long> profileIds = agentProfileRepository.findAllByAgentId(agentId).stream()
                    .map(AgentProfile::getProfileId) // Extract profile IDs
                    .collect(Collectors.toList());

            // Retrieve all Profile objects associated with these profile IDs
            List<Profile> profiles = profileRepository.findAllById(profileIds);
            MDC.put("agent_id", agentId);
            MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));
            log.info("{} retrieved all profiles at {}", MDC.get("agent_id"), MDC.get("date_time"));
            return profiles;
        } finally {
            MDC.clear();
        }
    }

    public Optional<Profile> getProfileById(Long id, String agentId) {
        try {
            // Check if the profile is associated with the given agentId
            Optional<AgentProfile> agentProfile = agentProfileRepository.findByAgentIdAndProfileId(agentId, id);

            if (agentProfile.isPresent()) {
                // If association exists, retrieve and return the Profile
                Optional<Profile> profile = profileRepository.findById(id);

                MDC.put("agent_id", agentId);
                MDC.put("profile_id", id.toString());
                MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));
                log.info("{} retrieved profile {} at {}", MDC.get("agent_id"), MDC.get("profile_id"),
                        MDC.get("date_time"));

                return profile;
            } else {
                // Deny the request if the association does not exist
                MDC.put("agent_id", agentId);
                MDC.put("profile_id", id.toString());
                log.warn("Access denied for agent {} to profile {}", MDC.get("agent_id"), MDC.get("profile_id"));
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "You are not authorized to access this profile.");
            }
        } finally {
            MDC.clear();
        }
    }

    public Optional<Profile> getProfileByVerificationToken(String token) {
        return profileRepository.findByVerificationToken(token);
    }

    @Transactional
    public Profile saveProfile(Profile profile) {
        try {
            Profile savedProfile = profileRepository.save(profile);

            MDC.put("profile_id", savedProfile.getId().toString());
            MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));
            log.info("Saved profile {} at {}", MDC.get("profile_id"), MDC.get("date_time"));

            return savedProfile;
        } catch (DataAccessException e) {
            log.error("An error occurred while saving the profile: {}", e.getMessage(), e);
            throw e;
        } finally {
            MDC.clear();
        }
    }

    @Transactional
    public Profile saveProfile(Profile profile, String agentId) {
        try {
            Profile savedProfile = profileRepository.save(profile);
            // Retrieve or create the AgentProfile
            if (!agentProfileRepository.existsByAgentIdAndProfileId(agentId, savedProfile.getId())) {
                // Step 3: Create and save the AgentProfile with the generated `profile_id`
                AgentProfile agentProfile = new AgentProfile();
                agentProfile.setAgentId(agentId);
                agentProfile.setProfileId(savedProfile.getId());
                agentProfileRepository.save(agentProfile);
            }

            MDC.put("agent_id", agentId);
            MDC.put("profile_id", savedProfile.getId().toString());
            MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));
            log.info("{} saved profile {} at {}", MDC.get("agent_id"), MDC.get("profile_id"), MDC.get("date_time"));

            return savedProfile;
        } catch (DataAccessException e) {
            log.error("An error occurred while saving the profile: {}", e.getMessage(), e);
            throw e;
        } finally {
            MDC.clear();
        }
    }

    @Transactional
    public Profile updateProfile(Long id, Profile updatedProfile, String agentId) {
        // Check if the agent has access to the profile
        if (!agentProfileRepository.existsByAgentIdAndProfileId(agentId, id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You are not authorized to access this profile.");
        }
        Optional<Profile> existingProfileOptional = profileRepository.findById(id);

        if (existingProfileOptional.isPresent()) {
            // Save the updated profile
            profileRepository.save(updatedProfile);

            // Log the update operation (if necessary)
            MDC.put("agent_id", agentId);
            MDC.put("profile_id", updatedProfile.getId().toString());
            MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));
            log.info("{} updated profile {} at {}", MDC.get("agent_id"), MDC.get("profile_id"), MDC.get("date_time"));

            return updatedProfile;
        } else {
            throw new DatabaseException("Profile not found with id: " + id, null);
        }
    }

    public void deleteProfile(Long id, String agentId) {
        try {
            MDC.put("agent_id", agentId);
            MDC.put("profile_id", id.toString());
            MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));

            long activeAccountCount = clientAccountRepository.countActiveAccountsByProfileId(id,
                    ClientAccount.AccountStatus.ACTIVE);
            if (activeAccountCount > 0) {
                log.info("Profile {} has active client accounts and cannot be deleted", id);
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Profile cannot be deleted due to active accounts.");
            }

            profileRepository.deleteById(id);
            log.info("Profile {} deleted successfully", id);
        } catch (DataAccessException e) {
            log.error("An error occurred while deleting the profile: {}", e.getMessage(), e);
            throw e;
        } finally {
            MDC.clear();
        }
    }

    public List<ProfileAccountsDTO> getAccountsGroupedByProfileId() {
        // Retrieve all accounts
        List<ClientAccount> accounts = clientAccountRepository.findAll();

        // Group accounts by profileId
        Map<Long, List<ClientAccount>> accountsByProfile = accounts.stream()
                .collect(Collectors.groupingBy(account -> account.getProfile().getId()));

        // Convert Map to List of ProfileAccountsDTO
        return accountsByProfile.entrySet().stream()
                .map(entry -> new ProfileAccountsDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
}