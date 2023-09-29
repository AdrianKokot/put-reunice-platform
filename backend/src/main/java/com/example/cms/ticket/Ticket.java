package com.example.cms.ticket;

import com.example.cms.page.Page;
import com.example.cms.user.User;
import lombok.Getter;
import lombok.Setter;
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
    public Ticket() {}

    public Ticket(String requesterEmail, String title, String description) {
        this.requesterEmail = requesterEmail;
        this.title = title;
        this.description = description;

        this.responses = new ArrayList<>();
        this.status = TicketStatus.NEW;
    }
    @Setter
    @Getter
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "page_id", nullable = false)
    private Page page;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "sha256-generator")
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;
    @NotEmpty(message = "Requester email must not be empty")
    private String requesterEmail;
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
                ", pageId='" + this.page.getId() + '\'' +
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
