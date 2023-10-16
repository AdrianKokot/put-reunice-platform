package com.example.cms.ticket.projections;

import com.example.cms.ticket.Response;
import com.example.cms.ticket.Ticket;
import com.example.cms.ticket.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

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
    private List<Response> responses;

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
        responses = ticket.getResponses();
    }
}
