package pl.motobudzet.api.user.dto;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationRequest {
    @NotEmpty
    @NotNull
    String userName;
    @NotEmpty
    @NotNull
    String password;
    @NotEmpty
    @NotNull
    String email;
}
