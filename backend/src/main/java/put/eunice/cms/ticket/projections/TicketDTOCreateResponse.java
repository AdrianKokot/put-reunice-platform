package put.eunice.cms.ticket.projections;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDTOCreateResponse {
    UUID ticketId;
    UUID ticketToken;
}
