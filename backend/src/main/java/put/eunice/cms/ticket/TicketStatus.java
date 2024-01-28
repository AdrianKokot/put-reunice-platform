package put.eunice.cms.ticket;

import java.util.List;
import put.eunice.cms.ticketUserStatus.exceptions.InvalidStatusChangeException;

public enum TicketStatus {
    RESOLVED(),
    DELETED(),
    IRRELEVANT(DELETED),
    HANDLED(IRRELEVANT, RESOLVED),
    NEW(IRRELEVANT, HANDLED, RESOLVED);

    private final List<TicketStatus> allowedStatusChanges;

    private TicketStatus(TicketStatus... allowedStatusChanges) {
        this.allowedStatusChanges = List.of(allowedStatusChanges);
    }

    public TicketStatus transition(TicketStatus status) throws InvalidStatusChangeException {
        if (!allowedStatusChanges.contains(status)) {
            throw new InvalidStatusChangeException();
        }

        return status;
    }
}
