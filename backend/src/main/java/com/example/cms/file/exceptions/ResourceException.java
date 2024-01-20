package com.example.cms.file.exceptions;

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
        switch (type) {
            case AUTHOR_NOT_VALID:
                return "authorId";
            default:
                return null;
        }
    }
}
