package com.example.cms.ticket.exceptions;

import com.example.cms.validation.exceptions.ForbiddenException;

public class TicketAccessForbiddenException extends ForbiddenException {
    public TicketAccessForbiddenException() {
        super("ERRORS.TICKET.403.NO_ACCESS_RIGHT_TO_CHANGE_TICKET_STATUS");
    }
}
