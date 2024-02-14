package pl.motobudzet.api.domain.location;


public class InvalidCityException extends RuntimeException {

    public static final String WRONG_CITY_NAME = "WRONG_CITY_NAME";

    public InvalidCityException() {
        super(WRONG_CITY_NAME);
    }
}