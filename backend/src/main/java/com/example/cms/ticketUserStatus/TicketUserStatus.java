package com.example.cms.ticketUserStatus;

import com.example.cms.user.User;
import com.example.cms.ticket.Ticket;
import lombok.*;


import javax.persistence.*;

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
    @JoinColumn(name = "ticket_id")
    Ticket ticket;

    TicketUserStatusEnum status;
}
