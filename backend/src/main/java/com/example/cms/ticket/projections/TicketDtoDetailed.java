package com.example.cms.ticket.projections;

import com.example.cms.ticket.Ticket;
import com.example.cms.ticket.TicketStatus;
import com.example.cms.ticketUserStatus.TicketUserStatus;
import com.example.cms.user.User;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDtoDetailed {
    private UUID id;
    private Long pageId;
    private String requesterEmail;
    private Instant requestedTime;
    private TicketStatus status;
    private String title;
    private String description;
    private Map<String, Optional<Instant>> lastSeenOn;
    private String pageTitle;
    private String universityName;
    private Instant lastUpdateTime;
    private LastChangedBy lastStatusChangeBy;

    public static TicketDtoDetailed of(Ticket ticket) {
        if (ticket == null) {
            return null;
        }
        return new TicketDtoDetailed(ticket);
    }

    public static TicketDtoDetailed of(Ticket ticket, Optional<User> lastStatusChangedBy) {
        if (ticket == null) {
            return null;
        }
        TicketDtoDetailed dto = new TicketDtoDetailed(ticket);

        if (lastStatusChangedBy.isPresent()) {
            User user = lastStatusChangedBy.get();
            dto.lastStatusChangeBy =
                    new LastChangedBy(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
        }

        return dto;
    }

    private TicketDtoDetailed(Ticket ticket) {
        id = ticket.getId();
        pageId = ticket.getPage().getId();
        requesterEmail = ticket.getRequesterEmail();
        requestedTime = ticket.getRequestedTime();
        status = ticket.getStatus();
        title = ticket.getTitle();
        description = ticket.getDescription();
        lastSeenOn =
                ticket.getTicketHandlers().stream()
                        .collect(
                                Collectors.toMap(
                                        item -> item.getUser().getUsername(), TicketUserStatus::getLastSeenOn));
        pageTitle = ticket.getPage().getTitle();
        universityName = ticket.getPage().getUniversity().getName();
        lastUpdateTime = ticket.getLastUpdateTime();
        lastStatusChangeBy = null;
    }
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class LastChangedBy {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}
