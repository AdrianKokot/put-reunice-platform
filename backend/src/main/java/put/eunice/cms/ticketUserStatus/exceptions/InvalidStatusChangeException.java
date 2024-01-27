package put.eunice.cms.ticketUserStatus.exceptions;

import put.eunice.cms.validation.exceptions.BadRequestException;

public class InvalidStatusChangeException extends BadRequestException {
    public InvalidStatusChangeException() {
        super("ERRORS.TICKET.400.INVALID_STATUS_CHANGE");
    }
}
