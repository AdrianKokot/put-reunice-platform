package com.example.cms.Ticket;

import com.example.cms.user.User;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.sql.Timestamp;
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
    @ManyToMany(mappedBy = "tickets", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH}, fetch = FetchType.LAZY)
    private Set<User> handlers = new HashSet<>();
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "sha256-generator")
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;
    @NotEmpty(message = "Requester email must not be empty")
    private String requesterEmail;
    private Long page_id;
    private Timestamp requestedTime;
    @Enumerated(EnumType.STRING)
    private TicketStatus status;
    private String title;
    private String description;
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Response> responses = new ArrayList<>();
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
//    public List<Response> getResponses() {
//        return responses;
//    }

}
