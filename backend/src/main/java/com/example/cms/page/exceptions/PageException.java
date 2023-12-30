package com.example.cms.page.exceptions;

import com.example.cms.validation.exceptions.BadRequestException;

public class PageException extends BadRequestException {

    public PageException(PageExceptionType type) {
        super(getMessage(type));
    }

    private static String getMessage(PageExceptionType type) {
        if (type == PageExceptionType.DELETING_WITH_CHILD) {
            return "ERRORS.PAGE.400.DELETING_WITH_CHILD";
        }
        if (type == PageExceptionType.CREATOR_NOT_VALID) {
            return "ERRORS.PAGE.400.CREATOR_NOT_VALID";
        }
        if (type == PageExceptionType.PARENT_NOT_FOUND) {
            return "ERRORS.PAGE.400.PARENT_NOT_FOUND";
        }
        return "ERRORS.400";
    }
}
