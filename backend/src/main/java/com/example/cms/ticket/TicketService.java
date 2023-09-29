package com.example.cms.ticket;

import com.example.cms.SearchCriteria;
import com.example.cms.ticket.exceptions.TicketNotFound;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    public void addResponse(Long ticketId, Response response) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(TicketNotFound::new);

        ticket.addResponse(response);
        ticketRepository.save(ticket);
    }

    @Secured("ROLE_ADMIN")
    public Page<Ticket> getTickets(Pageable pageable, Map<String, String> filterVars) {
        Specification<Ticket> combinedSpecification = null;

        if (!filterVars.isEmpty()) {
            List<TicketSpecification> specifications = filterVars.entrySet().stream()
                    .map(entries -> {
                        String[] filterBy = entries.getKey().split("_");

                        return new TicketSpecification(new SearchCriteria(
                                filterBy[0],
                                filterBy[filterBy.length - 1],
                                entries.getValue()
                        ));
                    }).collect(Collectors.toList());

            for (Specification<Ticket> spec : specifications) {
                if (combinedSpecification == null) {
                    combinedSpecification = Specification.where(spec);
                }
                combinedSpecification = combinedSpecification.and(spec);
            }
        }

        return ticketRepository.findAll(combinedSpecification, pageable);
    }
}
