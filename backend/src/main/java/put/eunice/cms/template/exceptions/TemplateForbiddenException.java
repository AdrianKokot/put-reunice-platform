package put.eunice.cms.template.exceptions;

import put.eunice.cms.validation.exceptions.ForbiddenException;

public class TemplateForbiddenException extends ForbiddenException {
    public TemplateForbiddenException() {
        super("ERRORS.TEMPLATE.403");
    }
}
