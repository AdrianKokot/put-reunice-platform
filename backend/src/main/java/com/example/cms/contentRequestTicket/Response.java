package com.example.cms.contentRequestTicket;

import com.example.cms.contentRequestTicket.ContentRequestTicket;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String author;
    private Timestamp responseTime;
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_request_ticket_id")
    private ContentRequestTicket contentRequestTicket;

    // Constructors, getters, and setters
}