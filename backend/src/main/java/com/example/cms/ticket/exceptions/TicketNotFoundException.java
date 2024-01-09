package com.example.cms.ticket.exceptions;

import com.example.cms.validation.exceptions.NotFoundException;

public class TicketNotFoundException extends NotFoundException {
    public TicketNotFoundException() {
        super("ERRORS.TICKET.404");
    }
}
