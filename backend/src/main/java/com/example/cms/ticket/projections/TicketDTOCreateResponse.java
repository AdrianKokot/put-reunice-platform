package com.example.cms.ticket.projections;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDTOCreateResponse {
    UUID ticketId;
    UUID ticketToken;
}
