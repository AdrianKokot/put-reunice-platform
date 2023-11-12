package com.example.cms.ticket;

import com.example.cms.ticket.projections.ResponseDtoCreate;
import com.example.cms.ticket.projections.TicketDto;
import com.example.cms.ticket.projections.TicketDtoDetailed;
import com.example.cms.validation.FilterPathVariableValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tickets")
public class TicketController {
    private final TicketService service;

    @GetMapping
    public ResponseEntity<List<TicketDto>> getTickets(
            Pageable pageable,
            @RequestParam Map<String, String> vars) {

        Page<Ticket> responsePage = service.getTickets(
                pageable,
                FilterPathVariableValidator.validate(vars, Ticket.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(TicketDto::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketDtoDetailed> getTicketDetailed(
            @PathVariable UUID ticketId
    ) {
        Ticket ticket = service.getTicketDetailed(ticketId);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(1));

        return new ResponseEntity<>(
                TicketDtoDetailed.of(ticket),
                httpHeaders,
                HttpStatus.OK);
    }

    @GetMapping("/{ticketId}/responses")
    public ResponseEntity<List<Response>> getTicketResponses(Pageable pageable, @PathVariable UUID ticketId) {
        Ticket ticket = service.getTickets(Pageable.ofSize(1), Map.of("id_eq", ticketId.toString()))
                .get().collect(Collectors.toList()).get(0);
        List<Response> responses = ticket.getResponses();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responses.size()));

        return new ResponseEntity<>(
                responses,
                httpHeaders,
                HttpStatus.OK);
    }

    @PostMapping("/{ticketId}/responses")
    public ResponseEntity<List<Response>> addResponse(
            @PathVariable UUID ticketId,
            @RequestBody ResponseDtoCreate responseDtoCreate
    ) {
        service.addResponse(ticketId, responseDtoCreate.getContent());

        Ticket ticket = service.getTickets(Pageable.ofSize(1), Map.of("id_eq", ticketId.toString()))
                .get().collect(Collectors.toList()).get(0);
        List<Response> responses = ticket.getResponses();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responses.size()));

        return new ResponseEntity<>(
                responses,
                httpHeaders,
                HttpStatus.OK);
    }
}
