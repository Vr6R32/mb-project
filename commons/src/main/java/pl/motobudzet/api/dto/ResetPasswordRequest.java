package pl.motobudzet.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record ResetPasswordRequest(
        @NotEmpty(message = "Adres email nie może być pusty !")
        @NotNull(message = "Adres email nie może być pusty !")
        @Email(message = "Podaj prawidłowy adres email !")
        String email
) {

}
