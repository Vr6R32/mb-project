package pl.motobudzet.api.domain.location;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "pl.motobudzet.api.adapter.rest")
public class LocationExceptionHandler {

    @ExceptionHandler(InvalidCityException.class)
    public ResponseEntity<String> handleInvalidCityNameException(InvalidCityException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

}