package put.eunice.cms.ticketUserStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketUserStatusRepository
        extends JpaRepository<TicketUserStatus, TicketUserStatusKey> {}
