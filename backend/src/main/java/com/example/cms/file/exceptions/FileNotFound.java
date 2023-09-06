package com.example.cms.file.exceptions;

import com.example.cms.validation.exceptions.NotFoundException;

public class FileNotFound extends NotFoundException {
    public FileNotFound() {
        super("ERRORS.FILE.404");
    }
}
