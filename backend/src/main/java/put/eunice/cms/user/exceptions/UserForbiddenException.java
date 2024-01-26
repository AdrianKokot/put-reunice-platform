package put.eunice.cms.user.exceptions;

import put.eunice.cms.validation.exceptions.ForbiddenException;

public class UserForbiddenException extends ForbiddenException {
    public UserForbiddenException() {
        super("ERRORS.USER.403");
    }
}
