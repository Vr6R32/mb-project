package pl.motobudzet.api.user.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice(basePackages = "pl.motobudzet.api.user.controller")
public class RegistrationExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {

        BindingResult result = ex.getBindingResult();
        List<FieldError> fieldErrors = result.getFieldErrors();

        List<String> errorMessages = new ArrayList<>();
        for (FieldError fieldError : fieldErrors) {
            errorMessages.add(fieldError.getDefaultMessage());
        }
        String errorMessagesList = errorMessages.toString();
        if (errorMessagesList.length() > 2) {
            errorMessagesList = errorMessagesList.substring(1, errorMessagesList.length() - 1);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessagesList);
    }
}
