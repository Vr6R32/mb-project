package pl.motobudzet.api.domain.model;

import lombok.Builder;
import pl.motobudzet.api.domain.brand.BrandDTO;

@Builder
public record ModelDTO(Long id, String name, BrandDTO brand) {

}
