package put.eunice.cms.university.exceptions;

import put.eunice.cms.validation.exceptions.BadRequestException;

public class UniversityException extends BadRequestException {

    public UniversityException(UniversityExceptionType type) {
        this(type, null);
    }

    public UniversityException(UniversityExceptionType type, String field) {
        super(getMessage(type), field);
    }

    private static String getMessage(UniversityExceptionType type) {
        switch (type) {
            case NAME_TAKEN:
                return "ERRORS.UNIVERSITY.400.NAME_TAKEN";
            case UNIVERSITY_IS_NOT_HIDDEN:
                return "ERRORS.UNIVERSITY.400.UNIVERSITY_NOT_HIDDEN";
            case ACTIVE_USER_EXISTS:
                return "ERRORS.UNIVERSITY.400.ACTIVE_USER_EXISTS";
            case IMAGE_UPLOAD_FAILED:
                return "ERRORS.UNIVERSITY.400.IMAGE_UPLOAD_FAILED";
            default:
                return "ERRORS.400";
        }
    }
}
