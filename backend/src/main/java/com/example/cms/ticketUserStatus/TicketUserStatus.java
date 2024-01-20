package com.example.cms.ticketUserStatus;

import com.example.cms.ticket.Ticket;
import com.example.cms.user.User;
import java.time.Instant;
import java.util.Optional;
import javax.persistence.*;

import lombok.Builder;
import lombok.Data;

@Entity
@Data
public class TicketUserStatus {
    @EmbeddedId TicketUserStatusKey id = new TicketUserStatusKey();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    User user;

    @ManyToOne
    @MapsId("ticketId")
    @JoinColumn(name = "ticket_id", columnDefinition = "uuid")
    Ticket ticket;

    Instant lastSeenOn;

    public Optional<Instant> getLastSeenOn() {
        return Optional.ofNullable(lastSeenOn);
    }
}
