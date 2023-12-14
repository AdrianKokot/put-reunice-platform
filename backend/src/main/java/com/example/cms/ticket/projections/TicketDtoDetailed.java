package com.example.cms.ticket.projections;

import com.example.cms.ticket.Ticket;
import com.example.cms.ticket.TicketStatus;
import com.example.cms.ticketUserStatus.TicketUserStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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

    public static TicketDtoDetailed of(Ticket ticket) {
        if (ticket == null) {
            return null;
        }
        return new TicketDtoDetailed(ticket);
    }

    private TicketDtoDetailed(Ticket ticket) {
        id = ticket.getId();
        pageId = ticket.getPage().getId();
        requesterEmail = ticket.getRequesterEmail();
        requestedTime = ticket.getRequestedTime();
        status = ticket.getStatus();
        title = ticket.getTitle();
        description = ticket.getDescription();
        lastSeenOn = ticket.getTicketHandlers().stream()
                .collect(Collectors.toMap(item -> item.getUser().getUsername(), TicketUserStatus::getLastSeenOn));
    }
}
