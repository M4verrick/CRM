package com.itsag3t1.crm.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.Date;

@Entity
@Table(name = "profiles")
public class Profile {
    // Getters for all fields
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Getter
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Getter
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Getter
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Getter
    @Column(name = "phone", length = 15)
    private String phone;

    @Getter
    @Column(name = "address", length = 100)
    private String address;

    @Getter
    @Column(name = "city", length = 50)
    private String city;

    @Getter
    @Column(name = "state", length = 50)
    private String state;

    @Getter
    @Column(name = "zip", length = 10)
    private String zip;

    @Getter
    @Column(name = "country", length = 50)
    private String country;

    @Getter
    @Temporal(TemporalType.DATE)
    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @Getter
    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "is_email_verified", nullable = false)
    private boolean isEmailVerified = false;

    @Getter
    @Column(name = "verification_token", length = 64)
    private String verificationToken;

    @Getter
    @Column(name = "verification_status", nullable = false, length = 20)
    private String verificationStatus = "PENDING";

    public Profile() {
    }

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

        public Builder(){

        }

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

        public Builder setVerificationStatus(String verificationStatus){
            this.verificationStatus = verificationStatus;
            return this;
        }

        public Profile build() {
            return new Profile(this);
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
    }
    public boolean isEmailVerified() {
        return isEmailVerified;
    }

}