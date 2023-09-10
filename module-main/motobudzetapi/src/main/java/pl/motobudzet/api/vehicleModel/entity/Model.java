package pl.motobudzet.api.vehicleModel.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import pl.motobudzet.api.vehicleBrand.entity.Brand;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private Brand brand;

}