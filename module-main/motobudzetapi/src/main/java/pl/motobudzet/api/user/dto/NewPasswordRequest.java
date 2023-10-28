package pl.motobudzet.api.user.dto;

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
public class NewPasswordRequest {
    @NotEmpty(message = "Hasło nie może być puste !")
    @NotNull(message = "Hasło nie może być puste !")
    String password;
    @NotEmpty(message = "Hasło nie może być puste !")
    @NotNull(message = "Hasło nie może być puste !")
    String passwordRepeat;
    @NotEmpty(message = "Kod resetujący nie może być pusty !")
    @NotNull(message = "Kod resetujący nie może być pusty !")
    String resetCode;
}
