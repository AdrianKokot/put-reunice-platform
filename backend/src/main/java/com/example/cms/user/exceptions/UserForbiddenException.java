package com.example.cms.user.exceptions;

import com.example.cms.validation.exceptions.ForbiddenException;

public class UserForbiddenException extends ForbiddenException {
    public UserForbiddenException() {
        super("ERRORS.USER.403");
    }
}
