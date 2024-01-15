package pl.motobudzet.api.user_account.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    @NotEmpty(message = "Adres email nie może być pusty !")
    @NotNull(message = "Adres email nie może być pusty !")
    @Email(message = "Podaj prawidłowy adres email !")
    String email;
}
