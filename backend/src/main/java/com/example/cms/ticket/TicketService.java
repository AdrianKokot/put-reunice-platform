package com.example.cms.ticket;

import com.example.cms.SearchCriteria;
import com.example.cms.page.PageRepository;
import com.example.cms.page.exceptions.PageForbidden;
import com.example.cms.page.exceptions.PageNotFound;
import com.example.cms.security.LoggedUser;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.ticket.exceptions.TicketNotFound;
import com.example.cms.ticketUserStatus.TicketUserStatus;
import com.example.cms.ticketUserStatus.TicketUserStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final PageRepository pageRepository;
    private final SecurityService securityService;
    private final TicketUserStatusRepository ticketUserStatusRepository;

    public void addResponse(UUID ticketId, String content) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(TicketNotFound::new);

        Optional<LoggedUser> loggedUserOptional = securityService.getPrincipal();
        String author = loggedUserOptional.isPresent() ? loggedUserOptional.get().getUsername() : "Anonymous";

        ticket.addResponse(new Response(author, content));
        ticketRepository.save(ticket);
    }

    public UUID createTicket(String requesterEmail, String title, String description, Long pageId) {
        com.example.cms.page.Page page = pageRepository.findById(pageId).orElseThrow(PageNotFound::new);
        if (securityService.isForbiddenPage(page)) {
            throw new PageForbidden();
        }

        Ticket ticket = ticketRepository.save(new Ticket(requesterEmail, title, description, page));
        ticket.setTicketHandlers(
                page.getHandlers().stream().map(handler -> {
                    TicketUserStatus ticketUserStatus = new TicketUserStatus();
                    ticketUserStatus.setLastSeenOn(Instant.now());
                    ticketUserStatus.setUser(handler);
                    ticketUserStatus.setTicket(ticket);
                    ticketUserStatusRepository.save(ticketUserStatus);
                    return ticketUserStatus;
                }).collect(Collectors.toSet()));

        return ticket.getId();
    }

    public Ticket getTicketDetailed(UUID ticketId) {
        Ticket ticket = this.getTickets(Pageable.ofSize(1), Map.of("id_eq", ticketId.toString()))
                .get().collect(Collectors.toList()).get(0);

        Optional<LoggedUser> loggedUserOptional = securityService.getPrincipal();
        if (loggedUserOptional.isPresent()) {
            Optional<TicketUserStatus> userStatusOptional = ticket.getTicketHandlers().stream()
                    .filter(item -> item.getUser()
                            .getId()
                            .equals(loggedUserOptional.get().getId()))
                    .findFirst();

            if (userStatusOptional.isPresent()) {
                TicketUserStatus userStatus = userStatusOptional.get();
                userStatus.setLastSeenOn(Instant.now());
                ticketUserStatusRepository.save(userStatus);
            }
        }

        return ticket;
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
