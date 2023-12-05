package com.example.cms.ticket;

import com.example.cms.ticketUserStatus.exceptions.InvalidStatusChangeException;
import java.util.List;

public enum TicketStatus {
    RESOLVED(),
    DELETED(),
    IRRELEVANT(DELETED),
    HANDLED(IRRELEVANT, RESOLVED),
    NEW(IRRELEVANT, HANDLED);

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
