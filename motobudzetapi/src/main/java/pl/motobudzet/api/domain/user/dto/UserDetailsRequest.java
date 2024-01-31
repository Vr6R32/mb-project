package pl.motobudzet.api.domain.user.dto;


import lombok.*;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class UserDetailsRequest {
    private String city;
    private String cityState;
    private String phoneNumber;
    private String name;
    private String surname;
}
