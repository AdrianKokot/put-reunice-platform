package com.example.cms.Ticket;

import com.example.cms.template.exceptions.TemplateNotFound;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public void addResponse(Long ticketId, Response response) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(TemplateNotFound::new);

        ticket.addResponse(response);
        ticketRepository.save(ticket);
    }
}
