package pl.motobudzet.api.vehicleBrand.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import pl.motobudzet.api.vehicleModel.entity.Model;

import java.util.List;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "brands")
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;
    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    private List<Model> modelList;

    public void addElement(Model element) {
        this.modelList.add(element);
    }

    public void deleteElement(Model element) {
        this.modelList.remove(element);
    }


}
