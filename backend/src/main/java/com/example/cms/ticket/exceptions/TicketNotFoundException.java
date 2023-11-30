package com.example.cms.ticket.exceptions;

import com.example.cms.validation.exceptions.ForbiddenException;

public class TicketNotFoundException extends ForbiddenException {
    public TicketNotFoundException() {
        super("ERRORS.TICKET.404");
    }
}
