package put.eunice.cms.validation.exceptions;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException() {
        super("ERRORS.401");
    }
}
