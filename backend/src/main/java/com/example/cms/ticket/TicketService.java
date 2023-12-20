package com.example.cms.ticket;

import com.example.cms.SearchCriteria;
import com.example.cms.page.PageRepository;
import com.example.cms.page.exceptions.PageForbiddenException;
import com.example.cms.page.exceptions.PageNotFoundException;
import com.example.cms.security.LoggedUser;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.ticket.exceptions.TicketAccessForbiddenException;
import com.example.cms.ticket.exceptions.TicketNotFoundException;
import com.example.cms.ticket.projections.TicketDtoDetailed;
import com.example.cms.ticket.projections.TicketDtoFormCreate;
import com.example.cms.ticketUserStatus.TicketUserStatus;
import com.example.cms.ticketUserStatus.TicketUserStatusRepository;
import com.example.cms.ticketUserStatus.exceptions.InvalidStatusChangeException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final PageRepository pageRepository;
    private final SecurityService securityService;
    private final TicketUserStatusRepository ticketUserStatusRepository;

    private Optional<TicketUserStatus> getIfLoggedUserIsHandler(Ticket ticket) {
        Optional<LoggedUser> loggedUserOptional = securityService.getPrincipal();
        return loggedUserOptional.flatMap(
                loggedUser ->
                        ticket.getTicketHandlers().stream()
                                .filter(item -> item.getUser().getId().equals(loggedUser.getId()))
                                .findFirst());
    }

    public void addResponse(UUID ticketId, String content) {
        Ticket ticket = getTicketById(ticketId);

        Optional<LoggedUser> loggedUserOptional = securityService.getPrincipal();
        String author =
                loggedUserOptional.isPresent() ? loggedUserOptional.get().getUsername() : "Anonymous";

        Optional<TicketUserStatus> userStatusOptional = getIfLoggedUserIsHandler(ticket);
        if (userStatusOptional.isPresent()) {
            try {
                ticket.setStatus(ticket.getStatus().transition(TicketStatus.HANDLED));
            } catch (Exception ignored) {
            }
        }

        ticket.addResponse(new Response(author, content));
        ticketRepository.save(ticket);
    }

    public UUID createTicket(TicketDtoFormCreate ticketDto) {
        com.example.cms.page.Page page =
                pageRepository.findById(ticketDto.getPageId()).orElseThrow(PageNotFoundException::new);

        Ticket ticket = ticketRepository.save(new Ticket(ticketDto.getRequesterEmail(), ticketDto.getTitle(), ticketDto.getDescription(), page));
        ticket.setTicketHandlers(
                page.getHandlers().stream()
                        .map(
                                handler -> {
                                    TicketUserStatus ticketUserStatus = new TicketUserStatus();
                                    ticketUserStatus.setLastSeenOn(null);
                                    ticketUserStatus.setUser(handler);
                                    ticketUserStatus.setTicket(ticket);
                                    ticketUserStatusRepository.save(ticketUserStatus);
                                    return ticketUserStatus;
                                })
                        .collect(Collectors.toSet()));

        return ticket.getId();
    }

    public Ticket getTicketDetailed(UUID ticketId) {
        Ticket ticket = this.getTicketById(ticketId);

        Optional<TicketUserStatus> userStatusOptional = getIfLoggedUserIsHandler(ticket);
        if (userStatusOptional.isPresent()) {
            TicketUserStatus userStatus = userStatusOptional.get();
            userStatus.setLastSeenOn(Instant.now());
            ticketUserStatusRepository.save(userStatus);
        }

        return ticket;
    }

    public Page<Ticket> getTickets(Pageable pageable, Map<String, String> filterVars) {
        Optional<LoggedUser> loggedUserOptional = securityService.getPrincipal();
        Role role = null;
        Collection<Long> handlesPages = null;
        String email = null;
        Long id = null;

        if (loggedUserOptional.isPresent()) {
            LoggedUser loggedUser = loggedUserOptional.get();
            role = loggedUser.getAccountType();
            handlesPages = loggedUser.getHandlesPages();
            email = loggedUser.getEmail();
            id = loggedUser.getId();
        }

        Specification<Ticket> combinedSpecification =
                Specification.where(new TicketRoleSpecification(role, handlesPages, email));

        if (filterVars.containsKey("unseen")) {
            filterVars.remove("unseen");
            combinedSpecification = combinedSpecification.and(new UnseenTicketSpecification(id));
        }

        if (!filterVars.isEmpty()) {
            List<TicketSpecification> specifications =
                    filterVars.entrySet().stream()
                            .map(
                                    entries -> {
                                        String[] filterBy = entries.getKey().split("_");

                                        return new TicketSpecification(
                                                new SearchCriteria(
                                                        filterBy[0], filterBy[filterBy.length - 1], entries.getValue()));
                                    })
                            .collect(Collectors.toList());

            for (Specification<Ticket> spec : specifications) {
                combinedSpecification = combinedSpecification.and(spec);
            }
        }

        return ticketRepository.findAll(combinedSpecification, pageable);
    }

    @Secured("ROLE_USER")
    public TicketDtoDetailed updateTicketStatus(TicketStatus statusToChangeTo, UUID ticketId)
            throws InvalidStatusChangeException {
        Ticket ticket = getTicketById(ticketId);
        Optional<TicketUserStatus> userStatusOptional = getIfLoggedUserIsHandler(ticket);

        if (userStatusOptional.isEmpty()) {
            throw new TicketAccessForbiddenException();
        }
        ticket.setStatus(ticket.getStatus().transition(statusToChangeTo));
        return TicketDtoDetailed.of(ticketRepository.save(ticket));
    }

    public Ticket getTicketById(UUID id) {
        return ticketRepository.findById(id).orElseThrow(TicketNotFoundException::new);
    }
}
