package com.example.cms.ticket.projections;

import com.example.cms.ticket.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDtoCreate {
    private String content;

    public static ResponseDtoCreate of(Response response) {
        if (response == null) {
            return null;
        }
        return new ResponseDtoCreate(response);
    }

    private ResponseDtoCreate(Response response) {
        content = response.getContent();
    }
}
