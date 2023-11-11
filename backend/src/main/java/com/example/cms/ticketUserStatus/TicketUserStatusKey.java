package com.example.cms.ticketUserStatus;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;

@Data
@Embeddable
public class TicketUserStatusKey implements Serializable {
    @Column(name = "user_id")
    Long userId;

    @Column(name = "ticket_id")
    UUID ticketId;
}
