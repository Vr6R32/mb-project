package pl.motobudzet.api.domain.advertisement.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice(basePackages = "pl.motobudzet.api.adapter.rest")
public class AdvertisementExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();
        List<FieldError> fieldErrors = result.getFieldErrors();

        List<String> errorMessages = new ArrayList<>();
        for (FieldError fieldError : fieldErrors) {
            errorMessages.add(fieldError.getDefaultMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("errors", errorMessages);
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Bad Request");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
