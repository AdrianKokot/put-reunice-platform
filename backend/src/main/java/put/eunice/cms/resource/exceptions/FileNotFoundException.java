package put.eunice.cms.resource.exceptions;

import put.eunice.cms.validation.exceptions.NotFoundException;

public class FileNotFoundException extends NotFoundException {
    public FileNotFoundException() {
        super("ERRORS.FILE.404");
    }
}
