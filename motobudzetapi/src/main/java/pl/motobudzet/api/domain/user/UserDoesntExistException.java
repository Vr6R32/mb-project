package pl.motobudzet.api.domain.user;

public class UserDoesntExistException extends RuntimeException {

    public UserDoesntExistException(String message) {
        super(message);
    }
}
