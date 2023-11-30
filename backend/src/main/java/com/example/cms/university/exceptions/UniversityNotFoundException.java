package com.example.cms.university.exceptions;

import com.example.cms.validation.exceptions.NotFoundException;

public class UniversityNotFoundException extends NotFoundException {
    public UniversityNotFoundException() {
        super("ERRORS.UNIVERSITY.404");
    }
}
