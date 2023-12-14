package com.example.cms.file.exceptions;

import com.example.cms.validation.exceptions.NotFoundException;

public class FileNotFoundException extends NotFoundException {
    public FileNotFoundException() {
        super("ERRORS.FILE.404");
    }
}
