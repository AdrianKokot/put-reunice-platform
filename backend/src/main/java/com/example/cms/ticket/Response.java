package com.example.cms.ticket;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name="responses")
@Getter
public class Response {
    public Response() {};
    public Response(String author, String content) {
        this.author = author;
        this.content = content;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String author;
    @CreationTimestamp
    private Instant responseTime;
    private String content;

    @Setter
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;
}