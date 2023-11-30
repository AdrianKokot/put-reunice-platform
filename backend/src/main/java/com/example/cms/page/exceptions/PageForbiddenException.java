package com.example.cms.page.exceptions;

import com.example.cms.validation.exceptions.ForbiddenException;

public class PageForbiddenException extends ForbiddenException {
    public PageForbiddenException() {
        super("ERRORS.PAGE.403");
    }
}
