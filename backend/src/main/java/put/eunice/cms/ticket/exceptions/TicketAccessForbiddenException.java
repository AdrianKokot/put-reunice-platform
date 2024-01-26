package put.eunice.cms.ticket.exceptions;

import put.eunice.cms.validation.exceptions.ForbiddenException;

public class TicketAccessForbiddenException extends ForbiddenException {
    public TicketAccessForbiddenException() {
        super("ERRORS.TICKET.403.NO_ACCESS_RIGHT_TO_CHANGE_TICKET_STATUS");
    }
}
