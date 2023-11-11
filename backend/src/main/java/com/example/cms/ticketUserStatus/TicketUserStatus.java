package com.example.cms.ticketUserStatus;

import com.example.cms.user.User;
import com.example.cms.ticket.Ticket;
import lombok.*;


import javax.persistence.*;
import java.time.Instant;

@Entity
@Data
public class TicketUserStatus {
    @EmbeddedId
    TicketUserStatusKey id = new TicketUserStatusKey();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    User user;

    @ManyToOne
    @MapsId("ticketId")
    @JoinColumn(name = "ticket_id", columnDefinition = "uuid")
    Ticket ticket;

    Instant lastSeenOn;
}
