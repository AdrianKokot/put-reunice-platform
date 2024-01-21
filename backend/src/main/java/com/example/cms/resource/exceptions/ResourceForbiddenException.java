package com.example.cms.resource.exceptions;

import com.example.cms.validation.exceptions.ForbiddenException;

public class ResourceForbiddenException extends ForbiddenException {
    public ResourceForbiddenException() {
        super("ERRORS.RESOURCE.403");
    }
}
