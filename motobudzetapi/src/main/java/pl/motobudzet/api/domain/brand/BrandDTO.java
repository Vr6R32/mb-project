package pl.motobudzet.api.domain.brand;

import lombok.*;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class BrandDTO {

    private Long id;
    private String name;

}
