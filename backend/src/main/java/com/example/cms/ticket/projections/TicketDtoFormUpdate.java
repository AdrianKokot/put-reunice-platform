package com.example.cms.ticket.projections;

import com.example.cms.ticket.Ticket;
import com.example.cms.ticket.TicketStatus;
import lombok.Getter;

@Getter
public class TicketDtoFormUpdate {
    TicketStatus ticketStatus;
    String title;
    String description;

    public void updateTicket(Ticket ticket) {
        ticket.setStatus(ticketStatus);
        ticket.setTitle(title);
        ticket.setDescription(description);
    }
}
