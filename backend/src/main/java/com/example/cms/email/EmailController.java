package com.example.cms.email;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/email")
public class EmailController {

    @Autowired
    private EmailSendingService emailSendingService;

    @PostMapping
    public String sendEmail() {
        // Hardcoded email details
        String receiver = "test@test.com";
        String subject = "Test Email";
        String body = "This is a test email message.";

        emailSendingService.sendEmail(receiver, subject, body);
        emailSendingService.sendConfirmAccountEmail(receiver,subject);

        return "Email sent successfully!";
    }
}