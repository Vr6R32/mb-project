package pl.motobudzet.api.advertisement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import pl.motobudzet.api.advertisement.model.MileageUnit;
import pl.motobudzet.api.advertisement.model.PriceUnit;
import pl.motobudzet.api.advertisement.model.Status;
import pl.motobudzet.api.location_city.City;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.vehicleBrand.Brand;
import pl.motobudzet.api.vehicleModel.Model;
import pl.motobudzet.api.vehicleSpec.model.DriveType;
import pl.motobudzet.api.vehicleSpec.model.EngineType;
import pl.motobudzet.api.vehicleSpec.model.FuelType;
import pl.motobudzet.api.vehicleSpec.model.TransmissionType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "advertisements")
@EntityListeners(AuditingEntityListener.class)
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
    private Long mileage;
    private Long price;
    private Long engineCapacity;
    private Long engineHorsePower;
    private Long productionDate;
    private LocalDate firstRegistrationDate;
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createDate;
    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime lastModified;
    @LastModifiedBy
    @Column(insertable = false)
    private Long lastModifiedBy;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Enumerated(EnumType.STRING)
    private MileageUnit mileageUnit;
    @Enumerated(EnumType.STRING)
    private PriceUnit priceUnit;
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private City city;
    @Enumerated(EnumType.STRING)
    private EngineType engineType;
    @Enumerated(EnumType.STRING)
    private DriveType driveType;
    @Enumerated(EnumType.STRING)
    private TransmissionType transmissionType;
    @Enumerated(EnumType.STRING)
    private FuelType fuelType;
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private Brand brand;
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private Model model;
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JsonBackReference
    private AppUser user;
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "advertisement_images",
            joinColumns = @JoinColumn(name = "advertisement_id")
    )
    private List<String> imageUrls;
}
