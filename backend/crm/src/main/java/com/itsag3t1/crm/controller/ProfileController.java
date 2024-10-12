package com.itsag3t1.crm.controller;

import com.itsag3t1.crm.model.Profile;
import com.itsag3t1.crm.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    @Autowired
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public List<Profile> getAllProfiles() {
        return profileService.getAllProfiles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profile> getProfileById(@PathVariable Long id) {
        Optional<Profile> profile = profileService.getProfileById(id);
        return profile.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Profile createProfile(@RequestBody Profile profile) {
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
                .build();
        return profileService.saveProfile(newProfile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profile> updateProfile(@PathVariable Long id, @RequestBody Profile profileDetails) {
        Optional<Profile> profile = profileService.getProfileById(id);
        if (profile.isPresent()) {
            Profile updatedProfile = new Profile.Builder()
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
            profileService.saveProfile(updatedProfile);
            return ResponseEntity.ok(updatedProfile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        if (profileService.getProfileById(id).isPresent()) {
            profileService.deleteProfile(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}