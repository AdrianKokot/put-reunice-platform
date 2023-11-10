package com.example.cms.email;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import org.apache.commons.io.IOUtils;
import java.util.Objects;


@Service
public class EmailSendingService {
    @Autowired
    private JavaMailSender javaMailSender;
    private final ResourceLoader resourceLoader;
    public EmailSendingService(JavaMailSender javaMailSender, ResourceLoader resourceLoader) {
        this.javaMailSender = javaMailSender;
        this.resourceLoader = resourceLoader;
    }
    @Value("${spring.mail.username}")
    private String sender;

    public void sendEmail(String receiver, String subject, String body){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(sender);
        message.setTo(receiver);
        message.setSubject(subject);
        message.setText(body);
        javaMailSender.send(message);
    }

    public void sendEmailWithHtmlTemplate(String to, String subject, String templateName) throws IOException {
        String htmlContent = loadHtmlTemplate(templateName);

        // Use htmlContent as the body of your email
        // ... (rest of your email sending logic)

    }
    private String loadHtmlTemplate(String templateName) throws IOException {

        Resource resource = resourceLoader.getResource("classpath:emailTemplates/" + templateName + ".html");
        return IOUtils.toString(Objects.requireNonNull(resource.getInputStream()), StandardCharsets.UTF_8);
    }
    public void sendConfirmAccountEmail(String receiver, String subject) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(sender);
            helper.setTo(receiver);
            helper.setSubject(subject);

            String emailTemplateContent = loadHtmlTemplate("ConfirmEmail");
            helper.setText(emailTemplateContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            // Handle exceptions
            System.out.println(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
