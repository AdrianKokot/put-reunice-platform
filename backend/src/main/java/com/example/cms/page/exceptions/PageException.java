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
        if (type == PageExceptionType.CANNOT_HIDE_MAIN_PAGE) {
            return "ERRORS.PAGE.400.CANNOT_HIDE_MAIN_PAGE";
        }
        if (type == PageExceptionType.CANNOT_DELETE_MAIN_PAGE) {
            return "ERRORS.PAGE.400.CANNOT_DELETE_MAIN_PAGE";
        }
        if (type == PageExceptionType.CREATOR_EMPTY) {
            return "ERRORS.PAGE.400.CREATOR_EMPTY";
        }
        if (type == PageExceptionType.UNIVERSITY_EMPTY) {
            return "ERRORS.PAGE.400.UNIVERSITY_EMPTY";
        }
        return "ERRORS.400";
    }
}
