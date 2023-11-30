package com.example.cms.ticketUserStatus;

import java.io.Serializable;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class TicketUserStatusKey implements Serializable {
    @Column(name = "user_id")
    Long userId;

    @Column(name = "ticket_id")
    UUID ticketId;
}
