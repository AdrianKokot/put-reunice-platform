package com.example.cms.page.exceptions;

import com.example.cms.validation.exceptions.BadRequestException;

public class PageException extends BadRequestException {

    public PageException(PageExceptionType type) {
        super(getMessage(type), getField(type));
    }

    private static String getMessage(PageExceptionType type) {
        switch (type) {
            case DELETING_WITH_CHILD:
                return "ERRORS.PAGE.400.DELETING_WITH_CHILD";
            case CREATOR_NOT_VALID:
                return "ERRORS.PAGE.400.CREATOR_NOT_VALID";
            case PARENT_NOT_FOUND:
                return "ERRORS.PAGE.400.PARENT_NOT_FOUND";
            case CANNOT_HIDE_MAIN_PAGE:
                return "ERRORS.PAGE.400.CANNOT_HIDE_MAIN_PAGE";
            case CANNOT_DELETE_MAIN_PAGE:
                return "ERRORS.PAGE.400.CANNOT_DELETE_MAIN_PAGE";
            case CREATOR_EMPTY:
                return "ERRORS.PAGE.400.CREATOR_EMPTY";
            case UNIVERSITY_EMPTY:
                return "ERRORS.PAGE.400.UNIVERSITY_EMPTY";
            default:
                return "ERRORS.400";
        }
    }

    private static String getField(PageExceptionType type) {
        switch (type) {
            case CREATOR_NOT_VALID:
            case CREATOR_EMPTY:
                return "creatorId";
            case PARENT_NOT_FOUND:
                return "parentId";
            case UNIVERSITY_EMPTY:
                return "universityId";
            default:
                return null;
        }
    }
}
