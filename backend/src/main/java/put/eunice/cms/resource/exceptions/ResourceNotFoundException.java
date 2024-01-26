package put.eunice.cms.resource.exceptions;

import put.eunice.cms.validation.exceptions.NotFoundException;

public class ResourceNotFoundException extends NotFoundException {
    public ResourceNotFoundException() {
        super("ERRORS.RESOURCE.404");
    }
}
