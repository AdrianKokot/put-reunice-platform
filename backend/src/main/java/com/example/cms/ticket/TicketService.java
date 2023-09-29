package com.example.cms.ticket;

import com.example.cms.template.exceptions.TemplateNotFound;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    public void addResponse(Long ticketId, Response response) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(TemplateNotFound::new);

        ticket.addResponse(response);
        ticketRepository.save(ticket);
    }
}
