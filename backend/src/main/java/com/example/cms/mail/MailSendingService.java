package com.example.cms.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class MailSendingService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String receiver, String subject, String body){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("test@gmail.com");
        message.setTo(receiver);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

}
