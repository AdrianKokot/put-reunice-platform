package com.example.cms.ticket.projections;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDtoFormCreate {
    private Long pageId;
    private String requesterEmail;
    private String title;
    private String description;
}
