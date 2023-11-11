package com.example.cms.ticket.projections;

import com.example.cms.security.Role;
import com.example.cms.ticket.Ticket;
import com.example.cms.ticket.TicketStatus;
import com.example.cms.university.projections.UniversityDtoSimple;
import com.example.cms.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

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
    private String requestedToken;
    private String contentRequestHandlerToken;

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
        requestedToken = ticket.getRequestedToken();
        contentRequestHandlerToken = ticket.getContentRequestHandlerToken();
    }
}
