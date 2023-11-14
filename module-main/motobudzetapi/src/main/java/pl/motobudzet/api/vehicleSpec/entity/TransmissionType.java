package pl.motobudzet.api.vehicleSpec.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "transmission_types")
public class TransmissionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;


}
