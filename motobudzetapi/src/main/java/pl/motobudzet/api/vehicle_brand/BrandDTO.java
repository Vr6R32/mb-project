package pl.motobudzet.api.vehicle_brand;


import lombok.*;
import pl.motobudzet.api.vehicle_model.Model;

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
