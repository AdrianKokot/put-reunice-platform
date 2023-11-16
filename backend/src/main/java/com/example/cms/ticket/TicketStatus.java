package com.example.cms.ticket;

import java.util.List;

public enum TicketStatus {
    RESOLVED(),
    DELETED(),
    IRRELEVANT(DELETED),
    HANDLED(IRRELEVANT, RESOLVED),
    NEW(IRRELEVANT, HANDLED);

    private final List<TicketStatus> allowedStatusChanges;

    private TicketStatus(TicketStatus ...allowedStatusChanges) {
        this.allowedStatusChanges = List.of(allowedStatusChanges);
    }

    public TicketStatus transition(TicketStatus status) throws Exception {
        if (!allowedStatusChanges.contains(status)) {
            throw new Exception("Illegal state");
        }

        return status;
    }
}