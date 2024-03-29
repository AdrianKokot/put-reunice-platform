package put.eunice.cms.email;

import java.util.Set;
import put.eunice.cms.ticket.Ticket;
import put.eunice.cms.ticketUserStatus.TicketUserStatus;
import put.eunice.cms.user.User;

public interface EmailSending {
    void sendEmail(String receiver, String subject, String body);

    String editContent(String content);

    void sendConfirmNewAccountEmail(User receiver, String password);

    void sendEditUserAccountMail(
            String oldEmail, User receiver, String adminUsername, String adminEmail);

    void sendEditUserAccountMail(
            String oldEmail, User receiver, String adminUsername, String adminEmail, String password);

    void sendChangeTicketStatusEmail(Ticket ticket);

    void sendChangeTicketStatusForCHREmail(Ticket ticket, String author);

    void sendDeleteAccountEmail(
            User receiver, String administratorUsername, String administratorEmail);

    void sendDisableAccountEmail(
            User receiver, String administratorUsername, String administratorEmail);

    void sendEnableAccountEmail(
            User receiver, String administratorUsername, String administratorEmail);

    void sendNewResponseInTicketEmail(Ticket ticket, String author, String content);

    void sendNewResponseInTicketEmail(
            Ticket ticket, String author, String content, Set<TicketUserStatus> ticketUserStatus);

    void sendNewRequestEmail(Ticket ticket, String author, String content);

    void sendNewRequestEmailCRH(
            Ticket ticket, String author, String content, Set<TicketUserStatus> ticketUserStatus);
}
