package com.example.cms.ticket;

import com.example.cms.SearchCriteria;
import com.example.cms.email.EmailSendingService;
import com.example.cms.page.PageRepository;
import com.example.cms.page.exceptions.PageNotFoundException;
import com.example.cms.security.LoggedUser;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.ticket.exceptions.TicketAccessForbiddenException;
import com.example.cms.ticket.exceptions.TicketNotFoundException;
import com.example.cms.ticket.projections.TicketDTOCreateResponse;
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
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final PageRepository pageRepository;
    private final SecurityService securityService;
    private final EmailSendingService emailSendingService;
    private final TicketUserStatusRepository ticketUserStatusRepository;

    private Optional<TicketUserStatus> getIfLoggedUserIsHandler(Ticket ticket) {
        Optional<LoggedUser> loggedUserOptional = securityService.getPrincipal();
        return loggedUserOptional.flatMap(
                loggedUser ->
                        ticket.getTicketHandlers().stream()
                                .filter(item -> item.getUser().getId().equals(loggedUser.getId()))
                                .findFirst());
    }

    public void addResponse(UUID ticketId, String content, Optional<UUID> token) {
        Ticket ticket = getTicketDetailed(ticketId, token);

        Optional<LoggedUser> loggedUserOptional = securityService.getPrincipal();
        String author =
                loggedUserOptional.isPresent()
                        ? loggedUserOptional.get().getUsername()
                        : ticket.getRequesterEmail();

        Optional<TicketUserStatus> userStatusOptional = getIfLoggedUserIsHandler(ticket);
        if (userStatusOptional.isPresent()) {
            try {
                ticket.setStatus(ticket.getStatus().transition(TicketStatus.HANDLED));
                emailSendingService.sendChangeTicketStatusEmail(ticket);
            } catch (Exception ignored) {
            }
        }

        ticket.addResponse(new Response(author, content));
        emailSendingService.sendNewResponseInTicketEmail(ticket, author, content);
        emailSendingService.sendNewResponseInTicketEmail(
                ticket, author, content, ticket.getTicketHandlers());
        ticketRepository.save(ticket);
    }

    public TicketDTOCreateResponse createTicket(TicketDtoFormCreate ticketDto) {
        com.example.cms.page.Page page =
                pageRepository.findById(ticketDto.getPageId()).orElseThrow(PageNotFoundException::new);

        Ticket ticket =
                ticketRepository.save(
                        new Ticket(
                                ticketDto.getRequesterEmail(),
                                ticketDto.getTitle(),
                                ticketDto.getDescription(),
                                page));
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

        emailSendingService.sendNewRequestEmail(
                ticket, ticket.getRequesterEmail(), ticket.getDescription());
        emailSendingService.sendNewRequestEmailCRH(
                ticket, ticket.getRequesterEmail(), ticket.getDescription(), ticket.getTicketHandlers());
        return new TicketDTOCreateResponse(ticket.getId(), ticket.getRequesterToken());
    }

    public Ticket getTicketDetailed(UUID ticketId, Optional<UUID> token) {
        Ticket ticket = ticketRepository.findById(ticketId).orElseThrow(TicketNotFoundException::new);

        Optional<TicketUserStatus> userStatusOptional = getIfLoggedUserIsHandler(ticket);
        if (userStatusOptional.isPresent()) {
            TicketUserStatus userStatus = userStatusOptional.get();
            userStatus.setLastSeenOn(Instant.now());
            ticketUserStatusRepository.save(userStatus);

            return ticket;
        }

        if (token.isPresent()) if (ticket.getRequesterToken().equals(token.get())) return ticket;

        Optional<LoggedUser> optionalLoggedUser = securityService.getPrincipal();
        if (optionalLoggedUser.isPresent())
            if (optionalLoggedUser.get().getAccountType().equals(Role.ADMIN)) return ticket;

        throw new TicketNotFoundException();
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

    public TicketDtoDetailed updateTicketStatus(
            TicketStatus statusToChangeTo, UUID ticketId, Optional<UUID> token)
            throws InvalidStatusChangeException {
        Ticket ticket = getTicketDetailed(ticketId, token);
        Optional<TicketUserStatus> userStatusOptional = getIfLoggedUserIsHandler(ticket);

        if (userStatusOptional.isEmpty()) {
            throw new TicketAccessForbiddenException();
        }
        ticket.setStatus(ticket.getStatus().transition(statusToChangeTo));
        emailSendingService.sendChangeTicketStatusEmail(ticket);
        emailSendingService.sendChangeTicketStatusForCHREmail(
                ticket, userStatusOptional.get().getUser().getEmail());
        return TicketDtoDetailed.of(ticketRepository.save(ticket));
    }
}
