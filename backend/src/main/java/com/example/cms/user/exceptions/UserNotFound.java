package com.example.cms.user.exceptions;

import com.example.cms.validation.exceptions.NotFoundException;

public class UserNotFound extends NotFoundException {
    public UserNotFound() {
        super("ERRORS.USER.404");
    }

    public UserNotFound(Long id) {
        super(String.format("ERRORS.USER.404 - user with id %s not found", id));
    }
}
