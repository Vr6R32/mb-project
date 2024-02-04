package pl.motobudzet.api.domain.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice(basePackages = "pl.motobudzet.api.adapter.rest")
public class UserExceptionHandler {

    @ExceptionHandler(UserDoesntExistException.class)
    public ResponseEntity<String> handleInvalidCityNameException(UserDoesntExistException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

}