package com.example.cms.ticket;

import com.example.cms.SearchCriteria;
import com.example.cms.page.PageRoleSpecification;
import com.example.cms.security.LoggedUser;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.ticket.exceptions.TicketNotFound;
import com.example.cms.user.User;
import com.example.cms.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final SecurityService securityService;
    public void addResponse(Long ticketId, Response response) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(TicketNotFound::new);

        ticket.addResponse(response);
        ticketRepository.save(ticket);
    }

    public Page<Ticket> getTickets(Pageable pageable, Map<String, String> filterVars) {
        Optional<LoggedUser> loggedUserOptional = securityService.getPrincipal();
        Role role = null;
        Collection<Long> handlesPages = null;
        String email = null;

        if (loggedUserOptional.isPresent()) {
            LoggedUser loggedUser = loggedUserOptional.get();
            role = loggedUser.getAccountType();
            handlesPages = loggedUser.getHandlesPages();
            email = loggedUser.getEmail();
        }

        Specification<Ticket> combinedSpecification = Specification.where(
                new TicketRoleSpecification(role,
                        handlesPages,
                        email));

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
                combinedSpecification = combinedSpecification.and(spec);
            }
        }

        return ticketRepository.findAll(combinedSpecification, pageable);
    }
}
