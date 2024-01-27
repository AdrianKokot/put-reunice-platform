package put.eunice.cms.resource.exceptions;

import put.eunice.cms.validation.exceptions.ForbiddenException;

public class ResourceForbiddenException extends ForbiddenException {
    public ResourceForbiddenException() {
        super("ERRORS.RESOURCE.403");
    }
}
