package com.example.cms.ticketUserStatus.exceptions;

import com.example.cms.validation.exceptions.BadRequestException;

public class InvalidStatusChangeException extends BadRequestException {
    public InvalidStatusChangeException () { super("ERROR.TICKET.400.INVALID_STATUS"); }
}
