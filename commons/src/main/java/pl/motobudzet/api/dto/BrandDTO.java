package pl.motobudzet.api.dto;

import lombok.Builder;

@Builder
public record BrandDTO(Long id, String name) {
}
