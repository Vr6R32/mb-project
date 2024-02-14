package pl.motobudzet.api.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record NewPasswordRequest(
        @NotEmpty(message = "Hasło nie może być puste !")
        @NotNull(message = "Hasło nie może być puste !")
        String password,
        @NotEmpty(message = "Hasło nie może być puste !")
        @NotNull(message = "Hasło nie może być puste !")
        String passwordRepeat,
        @NotEmpty(message = "Kod resetujący nie może być pusty !")
        @NotNull(message = "Kod resetujący nie może być pusty !")
        String resetCode
) {}