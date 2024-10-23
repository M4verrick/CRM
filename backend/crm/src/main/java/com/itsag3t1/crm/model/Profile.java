package com.itsag3t1.crm.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "address", length = 100)
    private String address;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "state", length = 50)
    private String state;

    @Column(name = "zip", length = 10)
    private String zip;

    @Column(name = "country", length = 50)
    private String country;

    @Temporal(TemporalType.DATE)
    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "is_email_verified", nullable = false)
    private boolean isEmailVerified = false;

    @Column(name = "verification_token", length = 64)
    private String verificationToken;

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

        public Profile build() {
            return new Profile(this);
        }
    }
}