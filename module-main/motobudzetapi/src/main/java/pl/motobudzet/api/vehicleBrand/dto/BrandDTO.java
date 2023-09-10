package pl.motobudzet.api.vehicleBrand.dto;


import lombok.*;
import pl.motobudzet.api.vehicleModel.entity.Model;

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
