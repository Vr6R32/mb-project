package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.brand.Brand;
import pl.motobudzet.api.domain.brand.BrandDTO;

public class BrandMapper {

    private BrandMapper() {
    }

    public static BrandDTO mapToBrandDTO(Brand brand) {
        return BrandDTO.builder()
                .name(brand.getName())
                .build();
    }
}
