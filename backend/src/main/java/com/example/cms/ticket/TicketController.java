package com.example.cms.ticket;

import com.example.cms.page.PageService;
import com.example.cms.ticket.projections.TicketDto;
import com.example.cms.user.User;
import com.example.cms.user.projections.UserDtoSimple;
import com.example.cms.validation.FilterPathVariableValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
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
}
