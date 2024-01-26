package put.eunice.cms.page.exceptions;

import put.eunice.cms.validation.exceptions.NotFoundException;

public class PageNotFoundException extends NotFoundException {
    public PageNotFoundException() {
        super("ERRORS.PAGE.404");
    }
}
