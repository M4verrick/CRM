package com.itsag3t1.crm.controller;

import com.itsag3t1.crm.model.Profile;
import com.itsag3t1.crm.service.EmailService;
import com.itsag3t1.crm.service.ProfileService;
import com.itsag3t1.crm.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/clients")
public class ProfileController {

    private final ProfileService profileService;
    private final EmailService emailService;

    @Autowired
    public ProfileController(ProfileService profileService, EmailService emailService) {
        this.profileService = profileService;
        this.emailService = emailService;
    }

    @GetMapping
    public List<Profile> getAllProfiles() {
        // Pass agentId to ProfileService to allow logging inside ProfileService
        return profileService.getAllProfiles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfileById(@PathVariable Long id, @RequestParam String agentId) {
        // Pass agentId to ProfileService to allow logging inside ProfileService
        Optional<Profile> profile = profileService.getProfileById(id, agentId);
        return profile.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Profile> createProfile(@RequestBody Profile profile, @RequestParam String agentId) {
        // Generate unique verification token
        String token = TokenUtil.generateVerificationToken();
        Profile newProfile = new Profile.Builder()
                .setFirstName(profile.getFirstName())
                .setLastName(profile.getLastName())
                .setEmail(profile.getEmail())
                .setPhone(profile.getPhone())
                .setAddress(profile.getAddress())
                .setCity(profile.getCity())
                .setState(profile.getState())
                .setZip(profile.getZip())
                .setCountry(profile.getCountry())
                .setDateOfBirth(profile.getDateOfBirth())
                .setGender(profile.getGender())
                .setVerificationToken(token)
                .setEmailVerified(false)
                .build();

        // Pass agentId to ProfileService to allow logging inside ProfileService
        Profile savedProfile = profileService.saveProfile(newProfile, agentId);

        // Send verification email after profile is created
        String verificationLink = "http://itsag3t1.com/api/clients/verify?token=" + token;
        emailService.sendVerificationEmail("hello@example.com", savedProfile.getFirstName(), verificationLink);

        return ResponseEntity.ok(savedProfile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(@PathVariable Long id, @RequestBody Profile profileDetails, @RequestParam String agentId) {
        Optional<Profile> profile = profileService.getProfileById(id, agentId);
        if (profile.isPresent()) {
            Profile updatedProfile = new Profile.Builder(profile.get())
                    .setId(id)
                    .setFirstName(profileDetails.getFirstName())
                    .setLastName(profileDetails.getLastName())
                    .setEmail(profileDetails.getEmail())
                    .setPhone(profileDetails.getPhone())
                    .setAddress(profileDetails.getAddress())
                    .setCity(profileDetails.getCity())
                    .setState(profileDetails.getState())
                    .setZip(profileDetails.getZip())
                    .setCountry(profileDetails.getCountry())
                    .setDateOfBirth(profileDetails.getDateOfBirth())
                    .setGender(profileDetails.getGender())
                    .build();

            // Pass agentId to ProfileService to allow logging inside ProfileService
            profileService.saveProfile(updatedProfile, agentId);
            return ResponseEntity.ok(updatedProfile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProfile(@PathVariable Long id, @RequestParam String agentId) {
        try {
            profileService.deleteProfile(id, agentId);
            return ResponseEntity.noContent().build();
        } catch (ResponseStatusException ex) {
            // Return a conflict response if profile cannot be deleted due to active accounts
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        }
    }


    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token, @RequestParam String agentId) {
        // Pass agentId to ProfileService to allow logging inside ProfileService
        Optional<Profile> optionalProfile = profileService.getProfileByVerificationToken(token, agentId);
        if (optionalProfile.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid verification token");
        }

        Profile profile = optionalProfile.get();
        Profile verifiedProfile = new Profile.Builder(profile)
                .setVerificationToken(null)
                .setEmailVerified(true)
                .build();

        // Pass agentId to ProfileService to allow logging inside ProfileService
        profileService.saveProfile(verifiedProfile, agentId);

        return ResponseEntity.ok("Email successfully verified.");
    }

    @PostMapping("/{clientId}/verify")
    public ResponseEntity<String> verifyClientIdentity(
            @PathVariable Long clientId,
            @RequestParam("nricNumber") String nricNumber,
            @RequestParam String agentId) {

        // Pass agentId to ProfileService to allow logging inside ProfileService
        Optional<Profile> optionalProfile = profileService.getProfileById(clientId, agentId);
        if (optionalProfile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Profile profile = optionalProfile.get();

        // Validate the NRIC number
        if (isValidNric(nricNumber)) {
            Profile updatedProfile = new Profile.Builder(profile)
                    .setVerificationStatus("VERIFIED")
                    .build();
            // Pass agentId to ProfileService to allow logging inside ProfileService
            profileService.saveProfile(updatedProfile, agentId);
            return ResponseEntity.ok("Your identity has been verified.");
        } else {
            Profile updatedProfile = new Profile.Builder(profile)
                    .setVerificationStatus("PENDING")
                    .build();
            // Pass agentId to ProfileService to allow logging inside ProfileService
            profileService.saveProfile(updatedProfile, agentId);
            return ResponseEntity.badRequest().body("Invalid NRIC number provided. Verification status is set to PENDING.");
        }
    }

    // NRIC validation method
    private boolean isValidNric(String nricNumber) {
        String nricPattern = "^[STFGM]\\d{7}[A-Z]$";
        return Pattern.matches(nricPattern, nricNumber);
    }
}
