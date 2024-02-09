package pl.motobudzet.api.domain.advertisement.entity;

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
import pl.motobudzet.api.model.MileageUnit;
import pl.motobudzet.api.model.PriceUnit;
import pl.motobudzet.api.model.Status;
import pl.motobudzet.api.domain.location.City;
import pl.motobudzet.api.domain.user.entity.AppUser;
import pl.motobudzet.api.domain.brand.Brand;
import pl.motobudzet.api.domain.model.Model;
import pl.motobudzet.api.model.DriveType;
import pl.motobudzet.api.model.EngineType;
import pl.motobudzet.api.model.FuelType;
import pl.motobudzet.api.model.TransmissionType;

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
    @Column(length = 17)
    private String vinNumber;
    private String mainPhotoUrl;
    private boolean accidentFree;
    private Long mileage;
    private Long price;
    private Long engineCapacity;
    private Long productionDate;
    private Long engineHorsePower;
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
    @Enumerated(EnumType.STRING)
    private EngineType engineType;
    @Enumerated(EnumType.STRING)
    private DriveType driveType;
    @Enumerated(EnumType.STRING)
    private TransmissionType transmissionType;
    @Enumerated(EnumType.STRING)
    private FuelType fuelType;
    @ManyToOne(fetch = FetchType.LAZY)
    private City city;
    @ManyToOne(fetch = FetchType.LAZY)
    private Brand brand;
    @ManyToOne(fetch = FetchType.LAZY)
    private Model model;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private AppUser user;
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "advertisement_images",
            joinColumns = @JoinColumn(name = "advertisement_id")
    )
    private List<String> imageUrls;
}
