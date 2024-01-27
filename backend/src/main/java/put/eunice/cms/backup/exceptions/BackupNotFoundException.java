package put.eunice.cms.backup.exceptions;

import put.eunice.cms.validation.exceptions.NotFoundException;

public class BackupNotFoundException extends NotFoundException {
    public BackupNotFoundException() {
        super("ERRORS.BACKUP.404");
    }
}
