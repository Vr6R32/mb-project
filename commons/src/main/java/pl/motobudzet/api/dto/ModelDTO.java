package pl.motobudzet.api.dto;

import lombok.Builder;

@Builder
public record ModelDTO(Long id, String name, BrandDTO brand) {

}
