package com.example.cms.ticket;

import com.example.cms.user.User;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "tickets")
public class Ticket {
    public enum TicketStatus {
        NEW,
        OPEN,
        RESOLVED,
        DISCARDED,
        CANCELED
    }

    public Ticket() {}

    public Ticket(String requesterEmail, Long page_id, String title, String description) {
        this.requesterEmail = requesterEmail;
        this.page_id = page_id;
        this.title = title;
        this.description = description;

        this.responses = new ArrayList<>();
    }
    @ManyToMany(mappedBy = "tickets", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH}, fetch = FetchType.LAZY)
    private Set<User> handlers = new HashSet<>();
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "sha256-generator")
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;
    @NotEmpty(message = "Requester email must not be empty")
    private String requesterEmail;
    private Long page_id;
    @CreationTimestamp
    private Instant requestedTime;
    @Enumerated(EnumType.STRING)
    private TicketStatus status;
    private String title;
    private String description;
    @Getter
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Response> responses;
    private String requestedToken;
    private String contentRequestHandlerToken;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", requesterEmail='" + requesterEmail + '\'' +
                ", pageId='" + page_id + '\'' +
                ", requestedTime='" + requestedTime + '\'' +
                ", status='" + status + '\'' +
                ", title='" + title + '\'' +
                ", content='" + description + '\'' +
                ", requestedToken='" + requestedToken + '\'' +
                ", contentRequestHandlerToken='" + contentRequestHandlerToken +
                '}';
    }

    public void addResponse(Response response) {
        response.setTicket(this);
        this.responses.add(response);
    }
}
