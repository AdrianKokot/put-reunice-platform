package put.eunice.cms.university.exceptions;

import put.eunice.cms.validation.exceptions.NotFoundException;

public class UniversityNotFoundException extends NotFoundException {
    public UniversityNotFoundException() {
        super("ERRORS.UNIVERSITY.404");
    }
}
