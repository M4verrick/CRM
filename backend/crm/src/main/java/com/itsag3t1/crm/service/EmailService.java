package com.itsag3t1.crm.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

@Service
public class EmailService {

    private final SesClient sesClient;

    // Use the verified sender email
    private static final String SENDER_EMAIL = "testipo21@gmail.com";

    // Initialize the SES client with specified region
    public EmailService() {
        this.sesClient = SesClient.builder()
                .region(Region.AP_SOUTHEAST_1)
                .build();
    }

    /**
     * Sends a verification email with a link for email verification.
     *
     * @param toEmail        Recipient's email address.
     * @param clientName     Name of the client.
     * @param verificationLink The link for email verification.
     */
    public void sendVerificationEmail(String toEmail, String clientName, String verificationLink) {

        // Define email subject and body
        String subject = "Please verify your email address";
        String bodyText = "Dear " + clientName + ",\n\n" +
                "Please verify your email address by clicking the following link:\n" +
                verificationLink + "\n\nThank you!";

        // Construct the email request for SES
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
                .source(SENDER_EMAIL) // Set the verified sender email
                .build();

        try {
            // Send email through SES
            SendEmailResponse response = sesClient.sendEmail(emailRequest);
            System.out.println("Verification email sent! Message ID: " + response.messageId());
        } catch (SesException e) {
            System.err.println("Failed to send verification email. Error: " + e.awsErrorDetails().errorMessage());
        }
    }
}
