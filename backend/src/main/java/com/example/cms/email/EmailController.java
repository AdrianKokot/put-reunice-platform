package com.example.cms.email;

import com.example.cms.email.EmailSendingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
public class EmailController {

    private final EmailSendingService emailSendingService;

    @Autowired
    public EmailController(EmailSendingService emailSendingService) {
        this.emailSendingService = emailSendingService;
    }

    @PostMapping("/send")
    public void sendEmail() {
        try {
            emailSendingService.sendEmail("test@mailpit", "Test", "This is an example");
            System.out.println("Fooo");
        } catch (Exception e) {
            System.out.println("Error sending email: " + e.getMessage());
        }
    }
}
