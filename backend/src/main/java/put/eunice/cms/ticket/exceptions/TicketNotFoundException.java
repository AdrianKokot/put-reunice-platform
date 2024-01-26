package put.eunice.cms.ticket.exceptions;

import put.eunice.cms.validation.exceptions.NotFoundException;

public class TicketNotFoundException extends NotFoundException {
    public TicketNotFoundException() {
        super("ERRORS.TICKET.404");
    }
}
