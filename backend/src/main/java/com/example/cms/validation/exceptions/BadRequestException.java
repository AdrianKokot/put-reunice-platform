package com.example.cms.validation.exceptions;

import lombok.Getter;

@Getter
public class BadRequestException extends RuntimeException {
    private String field = null;

    public BadRequestException() {
        super("ERRORS.400");
    }

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, String field) {
        super(message);
        this.field = field;
    }
}
