package com.example.cms.template.exceptions;

import com.example.cms.validation.exceptions.BadRequestException;

public class TemplateException extends BadRequestException {

    public TemplateException(TemplateExceptionType type) {
        this(type, null);
    }

    public TemplateException(TemplateExceptionType type, String field) {
        super(getMessage(type), field);
    }

    private static String getMessage(TemplateExceptionType type) {
        switch (type) {
            case CANNOT_CREATE_TEMPLATE_AVAILABLE_TO_ALL:
                return "ERRORS.TEMPLATE.400.CANNOT_CREATE_TEMPLATE_AVAILABLE_TO_ALL";
            case UNIVERSITY_FORBIDDEN:
                return "ERRORS.TEMPLATE.400.UNIVERSITY_FORBIDDEN";
            case CANNOT_MARK_AS_AVAILABLE_TO_ALL:
                return "ERRORS.TEMPLATE.400.CANNOT_MARK_AS_AVAILABLE_TO_ALL";
            default:
                return "ERRORS.400";
        }
    }
}
