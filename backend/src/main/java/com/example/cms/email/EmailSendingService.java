package com.example.cms.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailSendingService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${SMTP_USERNAME}")
    private String sender;
    public void sendEmail(String receiver, String subject, String body){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(sender);
        message.setTo(receiver);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

}
