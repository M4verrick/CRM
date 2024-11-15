package com.itsag3t1.crm.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itsag3t1.crm.exception.AgeException;
import com.itsag3t1.crm.model.Profile;
import com.itsag3t1.crm.service.EmailService;
import com.itsag3t1.crm.service.ProfileService;
import com.itsag3t1.crm.util.ClaimsUtil;
import com.itsag3t1.crm.util.TokenUtil;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf; // Import csrf()
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProfileController.class)
public class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProfileService profileService;

    @MockBean
    private EmailService emailService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testGetAllProfiles() throws Exception {
        // Prepare mock data
        List<Profile> profiles = Arrays.asList(
                new Profile.Builder()
                        .setId(1L)
                        .setFirstName("John")
                        .setLastName("Doe")
                        .setEmail("john.doe@example.com")
                        .setPhone("1234567890")
                        .setAddress("123 Main St")
                        .setCity("City")
                        .setState("State")
                        .setZip("12345")
                        .setCountry("Country")
                        .setDateOfBirth(new Date())
                        .setGender(Profile.Gender.MALE)
                        .build()
        );

        // Mock the dependencies
        String agentId = "agent123";
        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);
            when(profileService.getAllProfilesByAgentId(agentId)).thenReturn(profiles);

            mockMvc.perform(get("/api/clients")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    // Add more expectations as needed
                    .andExpect(jsonPath("$[0].firstName").value("John"))
                    .andExpect(jsonPath("$[0].lastName").value("Doe"))
                    .andExpect(jsonPath("$[0].email").value("john.doe@example.com"));
        }
    }

    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testGetProfileById() throws Exception {
        Long profileId = 1L;
        Profile profile = new Profile.Builder()
                .setId(profileId)
                .setFirstName("John")
                .setLastName("Doe")
                .setEmail("john.doe@example.com")
                .setPhone("1234567890")
                .setAddress("123 Main St")
                .setCity("City")
                .setState("State")
                .setZip("12345")
                .setCountry("Country")
                .setDateOfBirth(new Date())
                .setGender(Profile.Gender.MALE)
                .build();

        String agentId = "agent123";
        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);
            when(profileService.getProfileById(profileId, agentId)).thenReturn(Optional.of(profile));

            mockMvc.perform(get("/api/clients/{id}", profileId)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.firstName").value("John"))
                    .andExpect(jsonPath("$.lastName").value("Doe"))
                    .andExpect(jsonPath("$.email").value("john.doe@example.com"));
        }
    }

    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testGetProfileById_NotFound() throws Exception {
        Long profileId = 1L;
        String agentId = "agent123";
        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);
            when(profileService.getProfileById(profileId, agentId)).thenReturn(Optional.empty());

            mockMvc.perform(get("/api/clients/{id}", profileId)
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());
        }
    }

    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testCreateProfile() throws Exception {
        String agentId = "agent123";
        String token = "verification-token-123";
        Date dateOfBirth = new GregorianCalendar(1990, Calendar.JANUARY, 1).getTime();

        Profile profile = new Profile.Builder()
                .setFirstName("Jane")
                .setLastName("Doe")
                .setEmail("jane.doe@example.com")
                .setPhone("1234567890")
                .setAddress("456 Main St")
                .setCity("City")
                .setState("State")
                .setZip("12345")
                .setCountry("Country")
                .setDateOfBirth(dateOfBirth)
                .setGender(Profile.Gender.FEMALE)
                .build();

        Profile savedProfile = new Profile.Builder(profile)
                .setId(1L)
                .setVerificationToken(token)
                .setEmailVerified(false)
                .build();

        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class);
             MockedStatic<TokenUtil> tokenUtilMockedStatic = mockStatic(TokenUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);
            tokenUtilMockedStatic.when(TokenUtil::generateVerificationToken).thenReturn(token);

            when(profileService.saveProfile(any(Profile.class), eq(agentId))).thenReturn(savedProfile);

            // Do not actually send an email
            doNothing().when(emailService).sendVerificationEmail(anyString(), anyString(), anyString());

            String profileJson = objectMapper.writeValueAsString(profile);

            mockMvc.perform(post("/api/clients/createProfileAgent")
                            .with(csrf()) // Add CSRF token
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(profileJson))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.firstName").value("Jane"))
                    .andExpect(jsonPath("$.emailVerified").value(false))
                    .andExpect(jsonPath("$.verificationToken").value(token));

            // Verify that the email service was called
            verify(emailService, times(1)).sendVerificationEmail(eq("jane.doe@example.com"), eq("Jane"), anyString());
        }
    }

    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testCreateProfile_Underage() throws Exception {
        String agentId = "agent123";
        String token = "verification-token-123";
        Date dateOfBirth = new GregorianCalendar(2010, Calendar.JANUARY, 1).getTime(); // Age 13

        Profile profile = new Profile.Builder()
                .setFirstName("Jane")
                .setLastName("Doe")
                .setEmail("jane.doe@example.com")
                .setPhone("1234567890")
                .setAddress("456 Main St")
                .setCity("City")
                .setState("State")
                .setZip("12345")
                .setCountry("Country")
                .setDateOfBirth(dateOfBirth)
                .setGender(Profile.Gender.FEMALE)
                .build();

        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class);
             MockedStatic<TokenUtil> tokenUtilMockedStatic = mockStatic(TokenUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);
            tokenUtilMockedStatic.when(TokenUtil::generateVerificationToken).thenReturn(token);

            String profileJson = objectMapper.writeValueAsString(profile);

            mockMvc.perform(post("/api/clients/createProfileAgent")
                            .with(csrf()) // Add CSRF token
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(profileJson))
                    .andExpect(status().isBadRequest())
                    .andExpect(result -> assertTrue(result.getResolvedException() instanceof AgeException))
                    .andExpect(result -> assertEquals("User must be between 18 and 100 years old.", result.getResolvedException().getMessage()));
        }
    }

    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testUpdateProfile() throws Exception {
        Long profileId = 1L;
        String agentId = "agent123";

        Profile existingProfile = new Profile.Builder()
                .setId(profileId)
                .setFirstName("John")
                .setLastName("Doe")
                .setEmail("john.doe@example.com")
                .setPhone("1234567890")
                .setAddress("123 Main St")
                .setCity("City")
                .setState("State")
                .setZip("12345")
                .setCountry("Country")
                .setDateOfBirth(new Date())
                .setGender(Profile.Gender.MALE)
                .build();

        Profile updatedProfile = new Profile.Builder(existingProfile)
                .setFirstName("Johnny")
                .build();

        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);

            when(profileService.getProfileById(profileId, agentId)).thenReturn(Optional.of(existingProfile));
            when(profileService.updateProfile(eq(profileId), any(Profile.class), eq(agentId))).thenReturn(updatedProfile);

            String profileJson = objectMapper.writeValueAsString(updatedProfile);

            mockMvc.perform(put("/api/clients/{id}", profileId)
                            .with(csrf()) // Add CSRF token
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(profileJson))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.firstName").value("Johnny"));

            // Verify that the service method was called
            verify(profileService, times(1)).updateProfile(eq(profileId), any(Profile.class), eq(agentId));
        }
    }

    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testUpdateProfile_NotFound() throws Exception {
        Long profileId = 1L;
        String agentId = "agent123";

        Profile updatedProfile = new Profile.Builder()
                .setId(profileId)
                .setFirstName("Johnny")
                .build();

        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);

            when(profileService.getProfileById(profileId, agentId)).thenReturn(Optional.empty());

            String profileJson = objectMapper.writeValueAsString(updatedProfile);

            mockMvc.perform(put("/api/clients/{id}", profileId)
                            .with(csrf()) // Add CSRF token
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(profileJson))
                    .andExpect(status().isNotFound());

            // Verify that the service method was not called
            verify(profileService, never()).updateProfile(anyLong(), any(Profile.class), anyString());
        }
    }

    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testDeleteProfile() throws Exception {
        Long profileId = 1L;
        String agentId = "agent123";

        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);

            // Do nothing when deleteProfile is called
            doNothing().when(profileService).deleteProfile(profileId, agentId);

            mockMvc.perform(delete("/api/clients/{id}", profileId)
                            .with(csrf()) // Add CSRF token
                            .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNoContent());

            // Verify that the service method was called
            verify(profileService, times(1)).deleteProfile(profileId, agentId);
        }
    }

    @Test
    @WithMockUser // Add authentication if endpoint requires it
    public void testVerifyEmail() throws Exception {
        String token = "verification-token-123";
        Profile profile = new Profile.Builder()
                .setId(1L)
                .setFirstName("Jane")
                .setLastName("Doe")
                .setEmail("jane.doe@example.com")
                .setPhone("1234567890")
                .setAddress("456 Main St")
                .setCity("City")
                .setState("State")
                .setZip("12345")
                .setCountry("Country")
                .setDateOfBirth(new Date())
                .setGender(Profile.Gender.FEMALE)
                .setVerificationToken(token)
                .setEmailVerified(false)
                .build();

        Profile verifiedProfile = new Profile.Builder(profile)
                .setVerificationToken(null)
                .setEmailVerified(true)
                .build();

        when(profileService.getProfileByVerificationToken(token)).thenReturn(Optional.of(profile));
        when(profileService.saveProfile(any(Profile.class))).thenReturn(verifiedProfile);

        mockMvc.perform(get("/api/clients/verify")
                        .param("token", token))
                .andExpect(status().isOk())
                .andExpect(content().string("Email successfully verified."));

        // Verify that the profile was saved
        verify(profileService, times(1)).saveProfile(any(Profile.class));
    }

    @Test
    @WithMockUser // Add authentication if endpoint requires it
    public void testVerifyEmail_InvalidToken() throws Exception {
        String token = "invalid-token-123";

        when(profileService.getProfileByVerificationToken(token)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/clients/verify")
                        .param("token", token))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid verification token"));

        // Verify that the profile service was called
        verify(profileService, times(1)).getProfileByVerificationToken(token);
        // Verify that saveProfile was not called
        verify(profileService, never()).saveProfile(any(Profile.class));
    }

    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testVerifyClientIdentity_ValidNric() throws Exception {
        Long clientId = 1L;
        String agentId = "agent123";
        String nricNumber = "S1234567A";

        Profile profile = new Profile.Builder()
                .setId(clientId)
                .setFirstName("John")
                .setLastName("Doe")
                .setEmail("john.doe@example.com")
                .setPhone("1234567890")
                .setAddress("123 Main St")
                .setCity("City")
                .setState("State")
                .setZip("12345")
                .setCountry("Country")
                .setDateOfBirth(new Date())
                .setGender(Profile.Gender.MALE)
                .setVerificationStatus("PENDING")
                .build();

        Profile updatedProfile = new Profile.Builder(profile)
                .setVerificationStatus("VERIFIED")
                .build();

        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);

            when(profileService.getProfileById(clientId, agentId)).thenReturn(Optional.of(profile));
            when(profileService.saveProfile(any(Profile.class), eq(agentId))).thenReturn(updatedProfile);

            mockMvc.perform(post("/api/clients/{clientId}/verifyNRIC", clientId)
                            .with(csrf()) // Add CSRF token
                            .param("nricNumber", nricNumber))
                    .andExpect(status().isOk())
                    .andExpect(content().string("Your identity has been verified."));

            // Verify that the profile was saved
            verify(profileService, times(1)).saveProfile(any(Profile.class), eq(agentId));
        }
    }

    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testVerifyClientIdentity_InvalidNric() throws Exception {
        Long clientId = 1L;
        String agentId = "agent123";
        String nricNumber = "invalidNRIC";

        Profile profile = new Profile.Builder()
                .setId(clientId)
                .setFirstName("John")
                .setLastName("Doe")
                .setEmail("john.doe@example.com")
                .setPhone("1234567890")
                .setAddress("123 Main St")
                .setCity("City")
                .setState("State")
                .setZip("12345")
                .setCountry("Country")
                .setDateOfBirth(new Date())
                .setGender(Profile.Gender.MALE)
                .setVerificationStatus("PENDING")
                .build();

        Profile updatedProfile = new Profile.Builder(profile)
                .setVerificationStatus("PENDING")
                .build();

        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);

            when(profileService.getProfileById(clientId, agentId)).thenReturn(Optional.of(profile));
            when(profileService.saveProfile(any(Profile.class), eq(agentId))).thenReturn(updatedProfile);

            mockMvc.perform(post("/api/clients/{clientId}/verifyNRIC", clientId)
                            .with(csrf()) // Add CSRF token
                            .param("nricNumber", nricNumber))
                    .andExpect(status().isBadRequest())
                    .andExpect(content().string(containsString("Invalid NRIC number provided. Verification status is set to PENDING.")));

            // Verify that the profile was saved
            verify(profileService, times(1)).saveProfile(any(Profile.class), eq(agentId));
        }
    }

    @Test
    @WithMockUser(username = "agent123", roles = {"AGENT"})
    public void testVerifyClientIdentity_ProfileNotFound() throws Exception {
        Long clientId = 1L;
        String agentId = "agent123";
        String nricNumber = "S1234567A";

        try (MockedStatic<ClaimsUtil> claimsUtilMockedStatic = mockStatic(ClaimsUtil.class)) {
            claimsUtilMockedStatic.when(() -> ClaimsUtil.getAgentId(any(Authentication.class))).thenReturn(agentId);

            when(profileService.getProfileById(clientId, agentId)).thenReturn(Optional.empty());

            mockMvc.perform(post("/api/clients/{clientId}/verifyNRIC", clientId)
                            .with(csrf()) // Add CSRF token
                            .param("nricNumber", nricNumber))
                    .andExpect(status().isNotFound());

            // Verify that saveProfile was not called
            verify(profileService, never()).saveProfile(any(Profile.class));
        }
    }
}
