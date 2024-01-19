package com.example.cms.file.exceptions;

import com.example.cms.validation.exceptions.NotFoundException;

public class ResourceNotFoundException extends NotFoundException {
    public ResourceNotFoundException() {
        super("ERRORS.RESOURCE.404");
    }
}
