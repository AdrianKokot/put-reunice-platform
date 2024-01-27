package put.eunice.cms.page.exceptions;

import put.eunice.cms.validation.exceptions.ForbiddenException;

public class PageForbiddenException extends ForbiddenException {
    public PageForbiddenException() {
        super("ERRORS.PAGE.403");
    }
}
