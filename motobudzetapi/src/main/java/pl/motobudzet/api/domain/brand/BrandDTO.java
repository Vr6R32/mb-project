package pl.motobudzet.api.domain.brand;


import lombok.*;
import pl.motobudzet.api.domain.model.Model;

import java.util.List;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class BrandDTO {

    private Long id;
    private String name;
    private List<Model> modelList;

}
