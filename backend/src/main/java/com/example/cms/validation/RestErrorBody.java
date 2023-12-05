package com.example.cms.validation;

import java.util.List;
import javax.validation.ConstraintViolation;
import lombok.Data;
import lombok.Value;

@Data
public class RestErrorBody {
    @Value
    static class FieldViolation {
        String field;
        String message;

        FieldViolation(ConstraintViolation<?> violation) {
            field = violation.getPropertyPath().toString();
            message = violation.getMessage();
        }

        FieldViolation(String field, String message) {
            this.field = field;
            this.message = message;
        }
    }

    private final String message;
    private String error;
    private String status;
    private String url;
    private String method;
    private String exception;
    private List<FieldViolation> fieldViolations;
}
