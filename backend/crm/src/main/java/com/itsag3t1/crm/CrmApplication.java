package com.itsag3t1.crm;

import com.itsag3t1.crm.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CrmApplication {

    private final ProfileService profileService;

    @Autowired
    public CrmApplication(ProfileService profileService) {
        this.profileService = profileService;
    }

    public static void main(String[] args) {
        SpringApplication.run(CrmApplication.class, args);
    }
}