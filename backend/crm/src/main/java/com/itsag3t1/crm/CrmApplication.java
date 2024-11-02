package com.itsag3t1.crm;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CrmApplication {

    @Bean
    public CommandLineRunner logEnvVariables() {
        return args -> {
            System.out.println("DB_HOSTNAME: " + System.getenv("DB_HOSTNAME"));
            System.out.println("DB_PORT: " + System.getenv("DB_PORT"));
            System.out.println("DB_NAME: " + System.getenv("DB_NAME"));
            System.out.println("DB_USERNAME: " + System.getenv("DB_USERNAME"));
            System.out.println("DB_PASSWORD: " + System.getenv("DB_PASSWORD"));
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(CrmApplication.class, args);
    }
}