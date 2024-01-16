package com.example.cms.template.exceptions;

import com.example.cms.validation.exceptions.ForbiddenException;

public class TemplateForbiddenException extends ForbiddenException {
    public TemplateForbiddenException() {
        super("ERRORS.TEMPLATE.403");
    }
}
