package put.eunice.cms.ticket;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import put.eunice.cms.ticket.projections.ResponseDtoCreate;
import put.eunice.cms.ticket.projections.TicketDTOCreateResponse;
import put.eunice.cms.ticket.projections.TicketDtoDetailed;
import put.eunice.cms.ticket.projections.TicketDtoFormCreate;
import put.eunice.cms.user.User;
import put.eunice.cms.user.UserService;
import put.eunice.cms.validation.FilterPathVariableValidator;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tickets")
public class TicketController {
    private final TicketService service;
    private final ResponseRepository responseRepository;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<TicketDtoDetailed>> getTickets(
            Pageable pageable, @RequestParam Map<String, String> vars) {

        Page<Ticket> responsePage =
                service.getTickets(
                        pageable,
                        FilterPathVariableValidator.validate(
                                vars, Ticket.class, "handler", "pageId", "universityId"));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(TicketDtoDetailed::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<TicketDTOCreateResponse> createTicket(
            @RequestBody TicketDtoFormCreate ticketDto) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", "1");

        return new ResponseEntity<>(service.createTicket(ticketDto), httpHeaders, HttpStatus.OK);
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketDtoDetailed> getTicketDetailed(
            @PathVariable UUID ticketId, @RequestParam Optional<UUID> token) {
        Ticket ticket = service.getTicketDetailed(ticketId, token);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(1));

        Optional<User> userOptional = Optional.empty();
        if (ticket.getLastStatusChangeByUserId().isPresent())
            userOptional = userService.getUserObjectOptional(ticket.getLastStatusChangeByUserId().get());

        return new ResponseEntity<>(
                TicketDtoDetailed.of(ticket, userOptional), httpHeaders, HttpStatus.OK);
    }

    @GetMapping("/{ticketId}/responses")
    public ResponseEntity<List<Response>> getTicketResponses(
            @PageableDefault(
                            sort = {"responseTime"},
                            direction = Sort.Direction.ASC)
                    Pageable pageable,
            @PathVariable UUID ticketId,
            @RequestParam Optional<UUID> token) {
        Ticket ticket = service.getTicketDetailed(ticketId, token);
        List<Response> responses = responseRepository.findAllByTicket(pageable, ticket);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responses.size()));

        return new ResponseEntity<>(responses, httpHeaders, HttpStatus.OK);
    }

    @PutMapping("/{ticketId}")
    public ResponseEntity<?> updateTicketStatus(
            @PathVariable UUID ticketId,
            @RequestBody TicketStatus ticketStatusToChangeTo,
            @RequestParam Optional<UUID> token) {
        TicketDtoDetailed ticketDtoDetailed =
                service.updateTicketStatus(ticketStatusToChangeTo, ticketId, token);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(1));

        return new ResponseEntity<>(ticketDtoDetailed, httpHeaders, HttpStatus.OK);
    }

    @PostMapping("/{ticketId}/responses")
    public ResponseEntity<List<Response>> addResponse(
            @PathVariable UUID ticketId,
            @RequestBody ResponseDtoCreate responseDtoCreate,
            @RequestParam Optional<UUID> token) {
        service.addResponse(ticketId, responseDtoCreate.getContent(), token);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
