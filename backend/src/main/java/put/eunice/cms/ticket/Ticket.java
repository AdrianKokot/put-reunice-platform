package put.eunice.cms.ticket;

import java.time.Instant;
import java.util.*;
import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.lang.Nullable;
import put.eunice.cms.page.Page;
import put.eunice.cms.ticketUserStatus.TicketUserStatus;

@Entity
@Setter
@Getter
@Table(name = "tickets")
public class Ticket {
    public Ticket() {}

    public Ticket(String requesterEmail, String title, String description, Page page) {
        this.requesterEmail = requesterEmail;
        this.title = title;
        this.description = description;
        this.page = page;

        this.ticketHandlers = new HashSet<>();
        this.responses = new HashSet<>();
        this.status = TicketStatus.NEW;
    }

    @ManyToOne private Page page;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<TicketUserStatus> ticketHandlers;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid")
    private UUID id;

    @NotEmpty(message = "ERRORS.TICKET.400.REQUESTER_EMAIL_EMPTY")
    private String requesterEmail;

    @CreationTimestamp private Instant requestedTime;
    @UpdateTimestamp private Instant lastUpdateTime;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    @Nullable private Long lastStatusChangeByUserId;

    private String title;
    private String description;

    @OneToMany(
            mappedBy = "ticket",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER)
    @OrderBy("responseTime ASC")
    private Set<Response> responses;

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid")
    private UUID requesterToken;

    @Override
    public String toString() {
        return "Ticket{"
                + "id="
                + id
                + ", requesterEmail='"
                + requesterEmail
                + '\''
                + ", pageId='"
                + this.page.getId()
                + '\''
                + ", requestedTime='"
                + requestedTime
                + '\''
                + ", status='"
                + status
                + '\''
                + ", title='"
                + title
                + '\''
                + ", content='"
                + description
                + '\''
                + ", requestedToken='"
                + requesterToken
                + '}';
    }

    public void addResponse(Response response) {
        response.setTicket(this);
        this.responses.add(response);
    }

    public Optional<Long> getLastStatusChangeByUserId() {
        return Optional.ofNullable(this.lastStatusChangeByUserId);
    }

    @PrePersist
    private void onCreate() {
        this.requesterToken = UUID.randomUUID();
    }
}
