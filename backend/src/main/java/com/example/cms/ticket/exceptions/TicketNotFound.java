package com.example.cms.ticket.exceptions;

import com.example.cms.validation.exceptions.ForbiddenException;

public class TicketNotFound extends ForbiddenException {
    public TicketNotFound() {
        super("ERRORS.TICKET.404");
    }
}
