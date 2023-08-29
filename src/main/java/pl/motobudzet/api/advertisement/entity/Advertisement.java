package pl.motobudzet.api.advertisement.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;
import pl.motobudzet.api.vehicleBrand.entity.Brand;
import pl.motobudzet.api.vehicleModel.entity.Model;
import pl.motobudzet.api.vehicleSpec.entity.DriveType;
import pl.motobudzet.api.vehicleSpec.entity.EngineType;
import pl.motobudzet.api.vehicleSpec.entity.FuelType;
import pl.motobudzet.api.vehicleSpec.entity.TransmissionType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "advertisement")
public class Advertisement {

    @Id
    @UuidGenerator
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String name;
    @Column(length = 60000)
    private String description;
    private String mainPhotoUrl;
    private Long productionDate;
    private LocalDate firstRegistrationDate;
    private LocalDateTime creationTime;
    private Long mileage;
    private Long price;
    private Long engineCapacity;
    private Long engineHorsePower;
    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
    private EngineType engineType;
    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
    private DriveType driveType;
    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
    private TransmissionType transmissionType;
    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
    private FuelType fuelType;
    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
    private Brand brand;
    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
    private Model model;
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "advertisement_images",
        joinColumns = @JoinColumn(name = "advertisement_id")
    )
    //@Column(name = "image_url", nullable = false)
    //@OrderColumn(name = "image_order", nullable = false)
    private List<String> imageUrls;
    private boolean isVerified;

}
