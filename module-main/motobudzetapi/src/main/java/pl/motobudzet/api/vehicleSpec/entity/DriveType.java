package pl.motobudzet.api.vehicleSpec.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "drive_types")
public class DriveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

}
