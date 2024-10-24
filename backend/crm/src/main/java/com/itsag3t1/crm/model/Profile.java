package com.itsag3t1.crm.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Size(min = 2, message = "First name must be at least 2 characters long" )
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @NotNull
    @Size(min = 2, message = "Last name must be at least 2 characters long" )
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
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
    @Email(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Please provide a valid email address")
    @NotNull
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotNull
    @Size(min = 10, message = "Phone number must be at least 10 digits long" )
    @Size(max = 15, message = "Phone number cannot exceed 15 digits")
    @Column(name = "phone", nullable = false, unique = true)
    private String phone;

    @NotNull
    @Size(min = 5, message = "Address must be at least 5 characters long" )
    @Size(max = 100, message = "Address cannot exceed 100 characters")
    @Column(name = "address", nullable = false)
    private String address;

    @NotNull
    @Size(min = 2, message = "City must be at least 2 characters long" )
    @Size(max = 50, message = "City cannot exceed 50 characters")
    @Column(name = "city", nullable = false)
    private String city;

    @NotNull
    @Size(min = 2, message = "State must be at least 2 characters long" )
    @Size(max = 50, message = "State cannot exceed 50 characters")
    @Column(name = "state", nullable = false)
    private String state;

    @NotNull
    @Size(min = 2, message = "Country must be at least 2 characters long" )
    @Size(max = 50, message = "Country cannot exceed 50 characters")
    @Column(name = "country", nullable = false)
    private String country;

    @NotNull
    @Size(min = 4, message = "Postal must be at least 4 characters long" )
    @Size(max = 10, message = "Postal code cannot exceed 10 characters")
    @Column(name = "zip", nullable = false)
    private String zip;

    @Past
    @NotNull
    @Temporal(TemporalType.DATE)
    @Column(name = "date_of_birth", nullable = false)
    private Date dateOfBirth;

    @NotNull
    @Column(name = "gender", nullable = false)
    private String gender;

    @Column(name = "is_email_verified", nullable = false)
    private boolean isEmailVerified = false;

    @Column(name = "verification_token", length = 64)
    private String verificationToken;

    @Column(name = "verification_status", nullable = false, length = 20)
    private String verificationStatus = "PENDING";

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
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
        this.clientAccounts = builder.clientAccounts;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZip() {
        return zip;
    }

    public String getCountry() {
        return country;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public boolean isEmailVerified() {
        return isEmailVerified;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public List<ClientAccount> getClientAccounts() {
        return clientAccounts;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setEmailVerified(boolean emailVerified) {
        isEmailVerified = emailVerified;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public void setClientAccounts(List<ClientAccount> clientAccounts) {
        this.clientAccounts = clientAccounts;
    }

    // Method to add a single ClientAccount
    public void addClientAccount(ClientAccount account) {
        clientAccounts.add(account);
        account.setProfile(this);
    }

    // Method to remove a single ClientAccount
    public void removeClientAccount(ClientAccount account) {
        clientAccounts.remove(account);
        account.setProfile(null);
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
        private String gender;
        private boolean isEmailVerified = false;
        private String verificationToken;
        private String verificationStatus = "PENDING";
        private List<ClientAccount> clientAccounts = new ArrayList<>();

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
            this.clientAccounts = profile.getClientAccounts();
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

        public Builder setGender(String gender) {
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

        public Builder setClientAccounts(List<ClientAccount> clientAccounts) {
            this.clientAccounts = clientAccounts;
            return this;
        }

        public Profile build() {
            return new Profile(this);
        }
    }
}
