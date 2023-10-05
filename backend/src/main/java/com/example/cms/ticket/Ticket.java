package com.example.cms.ticket;

import com.example.cms.page.Page;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.time.Instant;
import java.util.*;


@Entity
@Getter
@Table(name = "tickets")
public class Ticket {
    public Ticket() {}

    public Ticket(String requesterEmail, String title, String description, Page page) {
        this.requesterEmail = requesterEmail;
        this.title = title;
        this.description = description;
        this.page = page;

        this.responses = new ArrayList<>();
        this.status = TicketStatus.NEW;
    }
    @Setter
    @ManyToOne
    private Page page;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @NotEmpty(message = "Requester email must not be empty")
    private String requesterEmail;
    @CreationTimestamp
    private Instant requestedTime;
    @Enumerated(EnumType.STRING)
    private TicketStatus status;
    private String title;
    private String description;
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
