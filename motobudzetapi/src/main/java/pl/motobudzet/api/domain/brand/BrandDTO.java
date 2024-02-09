package pl.motobudzet.api.domain.brand;

import lombok.*;

@Builder
public record BrandDTO(Long id, String name) {
}
