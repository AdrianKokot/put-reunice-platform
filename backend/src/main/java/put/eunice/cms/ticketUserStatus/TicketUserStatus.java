package put.eunice.cms.ticketUserStatus;

import java.time.Instant;
import java.util.Optional;
import javax.persistence.*;
import lombok.Data;
import put.eunice.cms.ticket.Ticket;
import put.eunice.cms.user.User;

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
