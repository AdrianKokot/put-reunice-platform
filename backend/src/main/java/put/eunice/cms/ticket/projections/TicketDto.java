package put.eunice.cms.ticket.projections;

import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.ticket.Ticket;
import put.eunice.cms.ticket.TicketStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDto {
    private UUID id;
    private Long pageId;
    private String requesterEmail;
    private Instant requestedTime;
    private TicketStatus status;
    private String title;
    private String description;
    private String pageTitle;
    private String universityName;

    public static TicketDto of(Ticket ticket) {
        if (ticket == null) {
            return null;
        }
        return new TicketDto(ticket);
    }

    private TicketDto(Ticket ticket) {
        id = ticket.getId();
        pageId = ticket.getPage().getId();
        requesterEmail = ticket.getRequesterEmail();
        requestedTime = ticket.getRequestedTime();
        status = ticket.getStatus();
        title = ticket.getTitle();
        description = ticket.getDescription();
        pageTitle = ticket.getPage().getTitle();
        universityName = ticket.getPage().getUniversity().getName();
    }
}
