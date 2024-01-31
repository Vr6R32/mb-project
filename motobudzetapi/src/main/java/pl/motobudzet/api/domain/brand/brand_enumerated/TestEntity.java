package pl.motobudzet.api.domain.brand.brand_enumerated;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestEntity {

    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    private Brand brand;

    @Convert(converter = ModelEnumConverter.class)
    private ModelEnumInterface model;


}
