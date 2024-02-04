package pl.motobudzet.api.domain.location;

public class InvalidCityException extends RuntimeException {

    public InvalidCityException(String message) {
        super(message);
    }

}