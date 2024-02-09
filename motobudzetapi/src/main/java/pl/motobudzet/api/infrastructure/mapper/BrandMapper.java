package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.brand.Brand;
import pl.motobudzet.api.dto.BrandDTO;

public class BrandMapper {

    private BrandMapper() {
    }

    public static BrandDTO mapToBrandDTO(Brand brand) {
        return BrandDTO.builder()
                .id(brand.getId())
                .name(brand.getName())
                .build();
    }

    public static Brand mapToBrandEntity(BrandDTO brand) {
        return Brand.builder()
                .id(brand.id())
                .name(brand.name())
                .build();
    }
}
