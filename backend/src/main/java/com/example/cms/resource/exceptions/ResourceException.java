package com.example.cms.resource.exceptions;

import com.example.cms.validation.exceptions.BadRequestException;

public class ResourceException extends BadRequestException {

    public ResourceException(ResourceExceptionType type) {
        super(getMessage(type), getField(type));
    }

    private static String getMessage(ResourceExceptionType type) {
        switch (type) {
            case AUTHOR_NOT_VALID:
                return "ERRORS.RESOURCE.400.AUTHOR_NOT_VALID";
            case FAILED_TO_STORE_FILE:
                return "ERRORS.RESOURCE.400.FAILED_TO_STORE_FILE";
            case FAILED_TO_DELETE_FILE:
                return "ERRORS.RESOURCE.400.FAILED_TO_DELETE_FILE";
            default:
                return "ERRORS.RESOURCE.400";
        }
    }

    private static String getField(ResourceExceptionType type) {
        if (type.equals(ResourceExceptionType.AUTHOR_NOT_VALID)) {
            return "authorId";
        }
        return null;
    }
}
