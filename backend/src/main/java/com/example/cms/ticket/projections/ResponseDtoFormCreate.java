package com.example.cms.ticket.projections;

import com.example.cms.ticket.Response;
import lombok.Getter;

@Getter
public class ResponseDtoFormCreate {
    String author;
    String content;

    public Response toResponse() {
        return new Response(this.author, this.content);
    }
}
