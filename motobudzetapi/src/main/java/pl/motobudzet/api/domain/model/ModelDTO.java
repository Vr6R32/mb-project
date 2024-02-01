package pl.motobudzet.api.domain.model;


import lombok.*;
import pl.motobudzet.api.domain.brand.BrandDTO;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ModelDTO {

    private Long id;
    private String name;
    private BrandDTO brand;

}
