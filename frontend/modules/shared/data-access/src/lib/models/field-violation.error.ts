export interface FieldViolationApiError {
  error: string;
  exception: string;
  fieldViolations: FieldViolation[];
  message: string;
  method: string;
  status: string;
  url: string;
}

export interface FieldViolation {
  field: string;
  message: string;
}
