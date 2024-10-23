package com.itsag3t1.crm.service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

import java.net.URI;

@Service
public class EmailService {

    private final SesClient sesClient;

    // Initialize the SES client
    public EmailService() {
        this.sesClient = SesClient.builder()
                .endpointOverride(URI.create("http://localhost:4566"))
                .region(Region.AP_SOUTHEAST_1)
                .build();
    }

    public void sendVerificationEmail(String toEmail, String clientName, String verificationLink) {

        String subject = "Please verify your email address";
        String bodyText = "Dear " + clientName + ",\n\n" +
                "Please verify your email address by clicking on the following link:\n" +
                verificationLink + "\n\nThank you!";

        // Construct the email request
        SendEmailRequest emailRequest = SendEmailRequest.builder()
                .destination(Destination.builder()
                        .toAddresses(toEmail)
                        .build())
                .message(Message.builder()
                        .subject(Content.builder()
                                .data(subject)
                                .charset("UTF-8")
                                .build())
                        .body(Body.builder()
                                .text(Content.builder()
                                        .data(bodyText)
                                        .charset("UTF-8")
                                        .build())
                                .build())
                        .build())
                .source("a@gmail.com")
                .build();

        try {
            SendEmailResponse response = sesClient.sendEmail(emailRequest);
            System.out.println("Email sent! Message ID: " + response.messageId());
        } catch (SesException e) {
            System.err.println("Email not sent. Error message: " + e.awsErrorDetails().errorMessage());
        }
    }
}