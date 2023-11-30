package com.example.cms.backup.exceptions;

import com.example.cms.validation.exceptions.NotFoundException;

public class BackupNotFoundException extends NotFoundException {
    public BackupNotFoundException() {
        super("ERRORS.BACKUP.404");
    }
}
