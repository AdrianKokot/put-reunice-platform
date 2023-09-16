package com.example.cms.contentRequestTicket;

import com.example.cms.user.User;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "contentRequestTickets")
public class ContentRequestTicket {
    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH}, fetch = FetchType.LAZY)
    @JoinTable(
            name = "CRHandlerTickets",
            joinColumns = @JoinColumn(name = "ticket_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> CRHandlers = new HashSet<>();
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotEmpty(message = "Requester email must not be empty")
    private String requesterEmail;

    private Long page_id;

    private Timestamp requestedTime;
    private String status;
    private String title;
    private String content;

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
                ", content='" + content + '\'' +
                ", requestedToken='" + requestedToken + '\'' +
                ", contentRequestHandlerToken='" + contentRequestHandlerToken +
                '}';
    }

}
