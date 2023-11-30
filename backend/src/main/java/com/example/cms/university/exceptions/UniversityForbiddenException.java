package com.example.cms.university.exceptions;

import com.example.cms.validation.exceptions.ForbiddenException;

public class UniversityForbiddenException extends ForbiddenException {
    public UniversityForbiddenException() {
        super("ERRORS.UNIVERSITY.403");
    }
}
