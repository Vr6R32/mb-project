package pl.motobudzet.api.vehicleSpec.entity;

import jakarta.persistence.*;
import lombok.*;
import pl.motobudzet.api.advertisement.entity.Advertisement;


@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class TransmissionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;


}
