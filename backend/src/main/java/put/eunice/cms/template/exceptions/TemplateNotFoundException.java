package put.eunice.cms.template.exceptions;

import put.eunice.cms.validation.exceptions.NotFoundException;

public class TemplateNotFoundException extends NotFoundException {
    public TemplateNotFoundException() {
        super("ERRORS.TEMPLATE.404");
    }
}
