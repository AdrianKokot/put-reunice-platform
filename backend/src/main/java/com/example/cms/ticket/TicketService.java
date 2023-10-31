package com.example.cms.ticket;

import com.example.cms.SearchCriteria;
import com.example.cms.page.PageRepository;
import com.example.cms.page.exceptions.PageForbidden;
import com.example.cms.page.exceptions.PageNotFound;
import com.example.cms.security.LoggedUser;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.ticket.exceptions.InvalidTicketStatusChange;
import com.example.cms.ticket.exceptions.TicketNotFound;
import com.example.cms.ticket.projections.TicketDto;
import com.example.cms.ticket.projections.TicketDtoDetailed;
import com.example.cms.ticket.projections.TicketDtoFormUpdate;
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

    public void addResponse(UUID ticketId, Response response) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(TicketNotFound::new);

        Optional<TicketUserStatus> userStatusOptional = ticket.getTicketHandlers().stream()
                .filter(item -> item.getUser()
                        .getId()
                        .equals(securityService.getPrincipal().get().getId()))
                .findFirst();
        if (ticket.getStatus().equals(TicketStatus.NEW) && userStatusOptional.isPresent()) {
            ticket.setStatus(TicketStatus.OPEN);
        }

        ticket.addResponse(response);
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

    public TicketDtoDetailed updateTicket(TicketDtoFormUpdate ticketDtoFormUpdate, UUID ticketId) throws InvalidTicketStatusChange {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(TicketNotFound::new);

        Optional<LoggedUser> loggedUserOptional = securityService.getPrincipal();

        Optional<TicketUserStatus> userStatusOptional = ticket.getTicketHandlers().stream()
                .filter(item -> item.getUser()
                        .getId()
                        .equals(loggedUserOptional.get().getId()))
                .findFirst();

        if (userStatusOptional.isPresent()) {
            if (!ticketDtoFormUpdate.getTicketStatus().equals(ticket.getStatus()) ||
                    ticketDtoFormUpdate.getTicketStatus().equals(TicketStatus.CANCELED) ||
                    ticketDtoFormUpdate.getTicketStatus().equals(TicketStatus.NEW)) {
                throw new InvalidTicketStatusChange();
            }
        } else {
            if (!ticketDtoFormUpdate.getTicketStatus().equals(ticket.getStatus()) ||
                    !ticketDtoFormUpdate.getTicketStatus().equals(TicketStatus.CANCELED)) {
                throw new InvalidTicketStatusChange();
            }
        }

        ticketDtoFormUpdate.updateTicket(ticket);
        return TicketDtoDetailed.of(ticketRepository.save(ticket));
    }
}
