package pl.motobudzet.api.vehicleBrand;


import lombok.*;
import pl.motobudzet.api.vehicleModel.Model;

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
