package put.eunice.cms.university.exceptions;

import put.eunice.cms.validation.exceptions.ForbiddenException;

public class UniversityForbiddenException extends ForbiddenException {
    public UniversityForbiddenException() {
        super("ERRORS.UNIVERSITY.403");
    }
}
