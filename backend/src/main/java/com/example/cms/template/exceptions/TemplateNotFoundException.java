package com.example.cms.template.exceptions;

import com.example.cms.validation.exceptions.NotFoundException;

public class TemplateNotFoundException extends NotFoundException {
    public TemplateNotFoundException() {
        super("ERRORS.TEMPLATE.404");
    }
}
