package put.eunice.cms.validation.exceptions;

public class WrongParameterException extends RuntimeException {

    /** Generated serial version UID. */
    private static final long serialVersionUID = 2646603237594341710L;

    /**
     * Constructs an exception with message of failure reason.
     *
     * @param message message of this exception
     */
    public WrongParameterException(String message) {
        super(message);
    }
}
