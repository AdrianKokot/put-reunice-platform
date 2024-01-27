package put.eunice.cms.backup.exceptions;

import put.eunice.cms.validation.exceptions.BadRequestException;

public class BackupException extends BadRequestException {
    public BackupException() {
        super("ERRORS.BACKUP.400");
    }
}
