package pl.motobudzet.api.domain.user.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record RegistrationRequest(
        @NotEmpty(message = "Nazwa użytkownika nie może być pusta !")
        @NotNull(message = "Nazwa użytkownika nie może być pusta !")
        String userName,
        @NotEmpty(message = "Hasło nie może być puste !")
        @NotNull(message = "Hasło nie może być puste !")
        String password,
        @NotEmpty(message = "Adres email nie może być pusty !")
        @NotNull(message = "Adres email nie może być pusty !")
        @Email(message = "Podaj prawidłowy adres email !")
        String email
) {}
