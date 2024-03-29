package put.eunice.cms.user.exceptions;

import put.eunice.cms.validation.exceptions.NotFoundException;

public class UserNotFoundException extends NotFoundException {
    public UserNotFoundException() {
        super("ERRORS.USER.404");
    }

    public UserNotFoundException(Long id) {
        super(String.format("ERRORS.USER.404 - user with id %s not found", id));
    }
}
