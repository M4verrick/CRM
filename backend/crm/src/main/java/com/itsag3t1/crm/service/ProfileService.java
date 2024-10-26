package com.itsag3t1.crm.service;

import com.itsag3t1.crm.model.Profile;
import com.itsag3t1.crm.repository.ProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {
    // ISO 8601 format for logging timestamps
    private static final SimpleDateFormat ISO_8601_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
    private final Logger log = LoggerFactory.getLogger(ProfileService.class);
    private final ProfileRepository profileRepository;

    @Autowired
    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public List<Profile> getAllProfiles() {
        try {
            List<Profile> profiles = profileRepository.findAll();

            // Log the action of retrieving all profiles
//            MDC.put("agent_id", agentId);
            MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));

            log.info("{} retrieved all profiles at {}", MDC.get("agent_id"), MDC.get("date_time"));

            return profiles;
        } finally {
            MDC.clear(); // Clear MDC after logging
        }
    }

    public Optional<Profile> getProfileById(Long id, String agentId) {
        try {
            Optional<Profile> profile = profileRepository.findById(id);

            // Log the action of retrieving profile by ID
            MDC.put("agent_id", agentId);
            MDC.put("profile_id", id.toString());
            MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));

            log.info("{} retrieved profile {} at {}", MDC.get("agent_id"), MDC.get("profile_id"), MDC.get("date_time"));

            return profile;
        } finally {
            MDC.clear(); // Clear MDC after logging
        }
    }

    public Optional<Profile> getProfileByVerificationToken(String token, String agentId) {
        try {
            Optional<Profile> profile = profileRepository.findByVerificationToken(token);

            // Log the action of retrieving profile by verification token
            MDC.put("agent_id", agentId);
            MDC.put("verification_token", token);
            MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));

            log.info("{} retrieved profile by token {} at {}", MDC.get("agent_id"), MDC.get("verification_token"), MDC.get("date_time"));

            return profile;
        } finally {
            MDC.clear(); // Clear MDC after logging
        }
    }

    public Profile saveProfile(Profile profile, String agentId) {
        try {
            Profile savedProfile = profileRepository.save(profile);

            // Log the action of saving the profile
            MDC.put("agent_id", agentId);
            MDC.put("profile_id", savedProfile.getId().toString());
            MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));

            log.info("{} saved profile {} at {}", MDC.get("agent_id"), MDC.get("profile_id"), MDC.get("date_time"));

            return savedProfile;
        } catch (DataAccessException e) {
            log.error("An error occurred while saving the profile: {}", e.getMessage(), e);
            throw e; // Re-throw the exception after logging
        } finally {
            MDC.clear(); // Clear MDC after logging
        }
    }

    public void deleteProfile(Long id, String agentId) {
        try {
            profileRepository.deleteById(id);

            // Log the action of deleting the profile
            MDC.put("agent_id", agentId);
            MDC.put("profile_id", id.toString());
            MDC.put("date_time", ISO_8601_FORMAT.format(new Date()));

            log.info("{} deleted profile {} at {}", MDC.get("agent_id"), MDC.get("profile_id"), MDC.get("date_time"));

        } catch (DataAccessException e) {
            log.error("An error occurred while deleting the profile: {}", e.getMessage(), e);
            throw e; // Re-throw the exception after logging
        } finally {
            MDC.clear(); // Clear MDC after logging
        }
    }
}
