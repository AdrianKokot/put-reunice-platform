package com.example.cms.page.exceptions;

import com.example.cms.validation.exceptions.NotFoundException;

public class PageNotFoundException extends NotFoundException {
    public PageNotFoundException() {
        super("ERRORS.PAGE.404");
    }
}
