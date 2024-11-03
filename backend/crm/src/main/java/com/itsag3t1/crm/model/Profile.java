package com.itsag3t1.crm.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "profiles")
public class Profile {
    // Setters
    // Getters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters long")
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "First name must contain only alphabetic characters and spaces")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotNull
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters long")
    @Pattern(regexp = "^[a-zA-Z\\s]*$", message = "Last name must contain only alphabetic characters and spaces")
    @Column(name = "last_name", nullable = false)
    private String lastName;

    /**
     * Email field with a custom simplified regular expression for basic validation.
     * This regex ensures the email:
     * - Starts with one or more alphanumeric characters, dots, underscores, percents, pluses, or hyphens.
     * - Contains exactly one "@" symbol.
     * - Has a valid domain part consisting of letters, numbers, dots, and hyphens.
     * - Ends with a top-level domain (TLD) of at least two letters.
     **/
    @NotNull
    @Email(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Please provide a valid email address")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotNull
    @Pattern(regexp = "\\+?[0-9]{10,15}", message = "Phone number must be between 10 and 15 digits, and may include an optional '+' prefix")
    @Column(name = "phone", nullable = false, unique = true)
    private String phone;

    @NotNull
    @Size(min = 5, max = 100, message = "Address must be between 5 and 100 characters long")
    @Column(name = "address", nullable = false)
    private String address;

    @NotNull
    @Size(min = 2, max = 50, message = "City must be between 2 and 50 characters long")
    @Column(name = "city", nullable = false)
    private String city;

    @NotNull
    @Size(min = 2, max = 50, message = "State must be between 2 and 50 characters long")
    @Column(name = "state", nullable = false)
    private String state;

    @NotNull
    @Size(min = 2, max = 50, message = "Country must be between 2 and 50 characters long")
    @Column(name = "country", nullable = false)
    private String country;

    @NotNull
    @Size(min = 4, max = 10, message = "Postal code must be between 4 and 10 characters long")
    @Pattern(regexp = "^[0-9A-Za-z-]+$", message = "Postal code must match the country's postal code format")
    @Column(name = "zip", nullable = false)
    private String zip;

    @Past
    @NotNull
    @Temporal(TemporalType.DATE)
    @Column(name = "date_of_birth", nullable = false)
    private Date dateOfBirth;

    @NotNull(message = "Gender is required")
    @Enumerated(EnumType.STRING)  // Stores the string representation of the enum in the database
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "is_email_verified", nullable = false)
    private boolean isEmailVerified = false;

    @Column(name = "verification_token", length = 64)
    private String verificationToken;

    @Column(name = "verification_status", nullable = false, length = 20)
    private String verificationStatus = "PENDING";

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ClientAccount> clientAccounts = new ArrayList<>();
    // No-argument constructor
    public Profile() {
    }

    // Builder constructor
    private Profile(Builder builder) {
        this.id = builder.id;
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.email = builder.email;
        this.phone = builder.phone;
        this.address = builder.address;
        this.city = builder.city;
        this.state = builder.state;
        this.zip = builder.zip;
        this.country = builder.country;
        this.dateOfBirth = builder.dateOfBirth;
        this.gender = builder.gender;
        this.isEmailVerified = builder.isEmailVerified;
        this.verificationToken = builder.verificationToken;
        this.verificationStatus = builder.verificationStatus;
    }

    public boolean isEmailVerified() {
        return isEmailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        isEmailVerified = emailVerified;
    }

    // Builder class
    public static class Builder {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String state;
        private String zip;
        private String country;
        private Date dateOfBirth;
        private Gender gender;
        private boolean isEmailVerified = false;
        private String verificationToken;
        private String verificationStatus = "PENDING";

        public Builder() {
        }

        public Builder(Profile profile) {
            this.id = profile.getId();
            this.firstName = profile.getFirstName();
            this.lastName = profile.getLastName();
            this.email = profile.getEmail();
            this.phone = profile.getPhone();
            this.address = profile.getAddress();
            this.city = profile.getCity();
            this.state = profile.getState();
            this.zip = profile.getZip();
            this.country = profile.getCountry();
            this.dateOfBirth = profile.getDateOfBirth();
            this.gender = profile.getGender();
            this.isEmailVerified = profile.isEmailVerified();
            this.verificationToken = profile.getVerificationToken();
            this.verificationStatus = profile.getVerificationStatus();
        }

        // Builder methods
        public Builder setId(Long id) {
            this.id = id;
            return this;
        }

        public Builder setFirstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public Builder setLastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setPhone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder setAddress(String address) {
            this.address = address;
            return this;
        }

        public Builder setCity(String city) {
            this.city = city;
            return this;
        }

        public Builder setState(String state) {
            this.state = state;
            return this;
        }

        public Builder setZip(String zip) {
            this.zip = zip;
            return this;
        }

        public Builder setCountry(String country) {
            this.country = country;
            return this;
        }

        public Builder setDateOfBirth(Date dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
            return this;
        }

        public Builder setGender(Gender gender) {
            this.gender = gender;
            return this;
        }

        public Builder setEmailVerified(boolean isEmailVerified) {
            this.isEmailVerified = isEmailVerified;
            return this;
        }

        public Builder setVerificationToken(String verificationToken) {
            this.verificationToken = verificationToken;
            return this;
        }

        public Builder setVerificationStatus(String verificationStatus) {
            this.verificationStatus = verificationStatus;
            return this;
        }

        public Profile build() {
            return new Profile(this);
        }


    }
    @Getter
    public enum Gender {
        MALE("Male"),
        FEMALE("Female"),
        NON_BINARY("Non-binary"),
        PREFER_NOT_TO_SAY("Prefer not to say");

        private final String displayName;

        Gender(String displayName) {
            this.displayName = displayName;
        }

    }

}
