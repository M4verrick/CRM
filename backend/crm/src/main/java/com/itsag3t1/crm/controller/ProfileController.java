package com.itsag3t1.crm.controller;

import com.itsag3t1.crm.exception.UnderageException;
import com.itsag3t1.crm.model.Profile;
import com.itsag3t1.crm.model.ProfileAccountsDTO;
import com.itsag3t1.crm.service.EmailService;
import com.itsag3t1.crm.service.ProfileService;
import com.itsag3t1.crm.util.ClaimsUtil;
import com.itsag3t1.crm.util.TokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/clients")
public class ProfileController {
    private static final Logger log = LoggerFactory.getLogger(ProfileController.class);

    private final ProfileService profileService;
    private final EmailService emailService;

    @Autowired
    public ProfileController(ProfileService profileService, EmailService emailService) {
        this.profileService = profileService;
        this.emailService = emailService;
    }

    @GetMapping("/all")
    public List<ProfileAccountsDTO> getAccountsGroupedByProfileId() {
        return profileService.getAccountsGroupedByProfileId();
    }

    @GetMapping
    public List<Profile> getAllProfiles(Authentication authentication) {
        String agentId = ClaimsUtil.getAgentId(authentication);
        log.info("Agent ID: {}", agentId);
        return profileService.getAllProfilesByAgentId(agentId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfileById(@PathVariable Long id, Authentication authentication) {
        String agentId = ClaimsUtil.getAgentId(authentication);
        Optional<Profile> profile = profileService.getProfileById(id, agentId);
        return profile.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Profile> createProfile(@RequestBody Profile profile, Authentication authentication) {
        String agentId = ClaimsUtil.getAgentId(authentication);
        String token = TokenUtil.generateVerificationToken();
        Date dateOfBirth = profile.getDateOfBirth();
        if(!isAtLeast18YearsOldbutLessThan100YearsOld(dateOfBirth)){
            throw new UnderageException("User must be at least 18 years old.");
        }
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

        Profile savedProfile = profileService.saveProfile(newProfile, agentId);
        String verificationLink = "http://itsag3t1.com/api/clients/verify?token=" + token;
        emailService.sendVerificationEmail(savedProfile.getEmail(), savedProfile.getFirstName(), verificationLink);

        return ResponseEntity.ok(savedProfile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(@PathVariable Long id, @RequestBody Profile profileDetails, Authentication authentication) {
        String agentId = ClaimsUtil.getAgentId(authentication);
        Optional<Profile> profile = profileService.getProfileById(id, agentId);
        if (profile.isPresent()) {
            Profile updatedProfile = new Profile.Builder(profile.get())
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

            profileService.saveProfile(updatedProfile, agentId);
            return ResponseEntity.ok(updatedProfile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProfile(@PathVariable Long id, Authentication authentication) {
        String agentId = ClaimsUtil.getAgentId(authentication);
        try {
            profileService.deleteProfile(id, agentId);
            return ResponseEntity.noContent().build();
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token, Authentication authentication) {
        String agentId = ClaimsUtil.getAgentId(authentication);
        Optional<Profile> optionalProfile = profileService.getProfileByVerificationToken(token, agentId);
        if (optionalProfile.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid verification token");
        }

        Profile profile = optionalProfile.get();
        Profile verifiedProfile = new Profile.Builder(profile)
                .setVerificationToken(null)
                .setEmailVerified(true)
                .build();

        profileService.saveProfile(verifiedProfile, agentId);
        return ResponseEntity.ok("Email successfully verified.");
    }

    @PostMapping("/{clientId}/verify")
    public ResponseEntity<String> verifyClientIdentity(
            @PathVariable Long clientId,
            @RequestParam("nricNumber") String nricNumber,
            Authentication authentication) {

        String agentId = ClaimsUtil.getAgentId(authentication);
        Optional<Profile> optionalProfile = profileService.getProfileById(clientId, agentId);
        if (optionalProfile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Profile profile = optionalProfile.get();
        if (isValidNric(nricNumber)) {
            Profile updatedProfile = new Profile.Builder(profile)
                    .setVerificationStatus("VERIFIED")
                    .build();
            profileService.saveProfile(updatedProfile, agentId);
            return ResponseEntity.ok("Your identity has been verified.");
        } else {
            Profile updatedProfile = new Profile.Builder(profile)
                    .setVerificationStatus("PENDING")
                    .build();
            profileService.saveProfile(updatedProfile, agentId);
            return ResponseEntity.badRequest().body("Invalid NRIC number provided. Verification status is set to PENDING.");
        }
    }

    private boolean isValidNric(String nricNumber) {
        String nricPattern = "^[STFGM]\\d{7}[A-Z]$";
        return Pattern.matches(nricPattern, nricNumber);
    }

    private boolean isAtLeast18YearsOldbutLessThan100YearsOld(Date dateOfBirth){
        LocalDate today = LocalDate.now();
        LocalDate dob = dateOfBirth.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        Period age = Period.between(dob,today);
        return age.getYears() >= 18 && age.getYears()<= 100;
    }
}