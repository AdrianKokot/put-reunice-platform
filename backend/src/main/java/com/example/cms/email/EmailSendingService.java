package com.example.cms.email;

import com.example.cms.ticket.Ticket;
import com.example.cms.user.User;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailSendingService {
    @Autowired private JavaMailSender javaMailSender;
    private Map<String, String> contentMap = new HashMap<>();
    private final ResourceLoader resourceLoader;

    public enum EmailTemplate {
        NEW_USER_ACCOUNT("NewUserAccount"),
        EDIT_USER_ACCOUNT("EditUserAccount"),
        EDIT_USER_ACCOUNT_WITH_PASSWORD("EditUserAccountWithPwd"),
        CHANGE_TICKET_STATUS("ChangeTicketStatus"),
        DELETE_USER_ACCOUNT("DeleteUserAccount"),
        DISABLE_USER_ACCOUNT("DisableUserAccount"),
        ENABLE_USER_ACCOUNT("EnableUserAccount");

        private final String templateName;

        EmailTemplate(String templateName) {
            this.templateName = templateName;
        }
    }

    public EmailSendingService(JavaMailSender javaMailSender, ResourceLoader resourceLoader) {
        this.javaMailSender = javaMailSender;
        this.resourceLoader = resourceLoader;
    }

    @Value("${spring.mail.username}")
    private String sender;

    @Async
    public void sendEmail(String receiver, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(sender);
        message.setTo(receiver);
        message.setSubject(subject);
        message.setText(body);
        javaMailSender.send(message);
    }

    public String editContent(String content) {
        if (content == null || contentMap == null) {
            throw new IllegalArgumentException("Content and editMap cannot be null");
        }

        for (Map.Entry<String, String> entry : contentMap.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            content = content.replace(key, value);
        }

        return content;
    }

    private String loadHtmlTemplate(String templateName) throws IOException {

        Resource resource =
                resourceLoader.getResource("classpath:emailTemplates/" + templateName + ".html");
        return IOUtils.toString(
                Objects.requireNonNull(resource.getInputStream()), StandardCharsets.UTF_8);
    }

    @Async
    public void sendConfirmNewAccountEmail(User receiver, String password) throws IOException {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(sender);
            helper.setTo(receiver.getEmail());
            helper.setSubject("Witaj w Reunice! Twoje konto zostało utworzone.");
            String emailTemplateContent = loadHtmlTemplate(EmailTemplate.NEW_USER_ACCOUNT.templateName);
            contentMap.put("[Nazwa Użytkownika]", receiver.getUsername());
            contentMap.put("[Początkowe Hasło]", password);
            contentMap.put("[link_do_pierwszego_logowania]", "http://localhost/auth/login");
            emailTemplateContent = editContent(emailTemplateContent);
            helper.setText(emailTemplateContent, true);
            javaMailSender.send(message);
            contentMap.clear();
        } catch (MessagingException e) {
            System.out.println(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Async
    public void sendEditUserAccountMail(
            String oldEmail, User receiver, String adminUsername, String adminEmail) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(sender);
            helper.setTo(oldEmail);
            helper.setSubject("Zmiany w Twoim koncie w systemie Reunice");
            String emailTemplateContent = loadHtmlTemplate(EmailTemplate.EDIT_USER_ACCOUNT.templateName);
            contentMap.put("[Nowa Nazwa Użytkownika]", receiver.getUsername());
            contentMap.put("[Nowy Adres E-mail]", receiver.getEmail());
            contentMap.put("[Nowe Imie]", receiver.getFirstName());
            contentMap.put("[Nowe Nazwisko]", receiver.getLastName());
            contentMap.put("[Nazwa Administratora]", adminUsername);
            contentMap.put("[E-mail Administratora]", adminEmail);
            emailTemplateContent = editContent(emailTemplateContent);
            helper.setText(emailTemplateContent, true);
            javaMailSender.send(message);
            contentMap.clear();
        } catch (MessagingException e) {
            System.out.println(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Async
    public void sendEditUserAccountMail(
            String oldEmail, User receiver, String adminUsername, String adminEmail, String password) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(sender);
            helper.setTo(oldEmail);
            helper.setSubject("Zmiany w Twoim koncie w systemie Reunice");
            String emailTemplateContent =
                    loadHtmlTemplate(EmailTemplate.EDIT_USER_ACCOUNT_WITH_PASSWORD.templateName);
            contentMap.put("[Nowa Nazwa Użytkownika]", receiver.getUsername());
            contentMap.put("[Nowy Adres E-mail]", receiver.getEmail());
            contentMap.put("[Nowe Imie]", receiver.getFirstName());
            contentMap.put("[Nowe Nazwisko]", receiver.getLastName());
            contentMap.put("[Nowe Haslo]", password);
            contentMap.put("[Nazwa Administratora]", adminUsername);
            contentMap.put("[E-mail Administratora]", adminEmail);
            emailTemplateContent = editContent(emailTemplateContent);
            helper.setText(emailTemplateContent, true);
            javaMailSender.send(message);
            contentMap.clear();
        } catch (MessagingException e) {
            System.out.println(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Async
    public void sendChangeTicketStatusEmail(Ticket ticket) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(sender);
            helper.setTo(ticket.getRequesterEmail());
            helper.setSubject("Zmiana statusu zapytania w systemie Reunice");
            String emailTemplateContent =
                    loadHtmlTemplate(EmailTemplate.CHANGE_TICKET_STATUS.templateName);
            contentMap.put("[Nowy Status]", ticket.getStatus().name());
            contentMap.put("[ticket_link]", "http://localhost/ticket" + ticket.getRequesterToken());
            emailTemplateContent = editContent(emailTemplateContent);
            helper.setText(emailTemplateContent, true);
            javaMailSender.send(message);
            contentMap.clear();
        } catch (MessagingException e) {
            System.out.println(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Async
    public void sendDeleteAccountEmail(
            User receiver, String administratorUsername, String administratorEmail) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(sender);
            helper.setTo(receiver.getEmail());
            helper.setSubject("Informacja o usunięciu konta w systemie Reunice");
            String emailTemplateContent =
                    loadHtmlTemplate(EmailTemplate.DELETE_USER_ACCOUNT.templateName);
            contentMap.put("[Nazwa Administratora]", administratorUsername);
            contentMap.put("[E-mail Administratora]", administratorEmail);
            emailTemplateContent = editContent(emailTemplateContent);
            helper.setText(emailTemplateContent, true);
            javaMailSender.send(message);
            contentMap.clear();
        } catch (MessagingException e) {
            System.out.println(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Async
    public void sendDisableAccountEmail(
            User receiver, String administratorUsername, String administratorEmail) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(sender);
            helper.setTo(receiver.getEmail());
            helper.setSubject("Twoje konto zostało wyłączone w systemie Reunice");
            String emailTemplateContent =
                    loadHtmlTemplate(EmailTemplate.DISABLE_USER_ACCOUNT.templateName);
            contentMap.put("[Nazwa Administratora]", administratorUsername);
            contentMap.put("[E-mail Administratora]", administratorEmail);
            emailTemplateContent = editContent(emailTemplateContent);
            helper.setText(emailTemplateContent, true);
            contentMap.clear();
            javaMailSender.send(message);
        } catch (MessagingException e) {
            System.out.println(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Async
    public void sendEnableAccountEmail(
            User receiver, String administratorUsername, String administratorEmail) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(sender);
            helper.setTo(receiver.getEmail());
            helper.setSubject("Twoje konto zostało włączone w systemie Reunice");
            String emailTemplateContent =
                    loadHtmlTemplate(EmailTemplate.ENABLE_USER_ACCOUNT.templateName);
            contentMap.put("[Nazwa Administratora]", administratorUsername);
            contentMap.put("[E-mail Administratora]", administratorEmail);
            emailTemplateContent = editContent(emailTemplateContent);
            helper.setText(emailTemplateContent, true);
            contentMap.clear();
            javaMailSender.send(message);
        } catch (MessagingException e) {
            System.out.println(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
