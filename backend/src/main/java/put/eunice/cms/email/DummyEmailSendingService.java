package put.eunice.cms.email;

import java.util.Set;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import put.eunice.cms.ticket.Ticket;
import put.eunice.cms.ticketUserStatus.TicketUserStatus;
import put.eunice.cms.user.User;

@Service
@Profile("test")
public class DummyEmailSendingService implements EmailSending {
    @Override
    public void sendEmail(String receiver, String subject, String body) {}

    @Override
    public String editContent(String content) {
        return null;
    }

    @Override
    public void sendConfirmNewAccountEmail(User receiver, String password) {}

    @Override
    public void sendEditUserAccountMail(
            String oldEmail, User receiver, String adminUsername, String adminEmail) {}

    @Override
    public void sendEditUserAccountMail(
            String oldEmail, User receiver, String adminUsername, String adminEmail, String password) {}

    @Override
    public void sendChangeTicketStatusEmail(Ticket ticket) {}

    @Override
    public void sendChangeTicketStatusForCHREmail(Ticket ticket, String author) {}

    @Override
    public void sendDeleteAccountEmail(
            User receiver, String administratorUsername, String administratorEmail) {}

    @Override
    public void sendDisableAccountEmail(
            User receiver, String administratorUsername, String administratorEmail) {}

    @Override
    public void sendEnableAccountEmail(
            User receiver, String administratorUsername, String administratorEmail) {}

    @Override
    public void sendNewResponseInTicketEmail(Ticket ticket, String author, String content) {}

    @Override
    public void sendNewResponseInTicketEmail(
            Ticket ticket, String author, String content, Set<TicketUserStatus> ticketUserStatus) {}

    @Override
    public void sendNewRequestEmail(Ticket ticket, String author, String content) {}

    @Override
    public void sendNewRequestEmailCRH(
            Ticket ticket, String author, String content, Set<TicketUserStatus> ticketUserStatus) {}
}
