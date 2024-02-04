package pl.motobudzet.api.domain.advertisement.dto;

import lombok.*;
import pl.motobudzet.api.domain.advertisement.model.*;
import pl.motobudzet.api.domain.brand.BrandDTO;
import pl.motobudzet.api.domain.location.CityDTO;
import pl.motobudzet.api.domain.model.ModelDTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class AdvertisementDTO {

    private UUID id;
    private String name;
    private String description;
    private ModelDTO model;
    private BrandDTO brand;
    private FuelType fuelType;
    private DriveType driveType;
    private EngineType engineType;
    private TransmissionType transmissionType;
    private String vinNumber;
    private Boolean accidentFree;
    private String mainPhotoUrl;
    private String user;
    private CityDTO city;
    private Long mileage;
    private Long price;
    private Long engineCapacity;
    private Long engineHorsePower;
    private Long productionDate;
    private MileageUnit mileageUnit;
    private PriceUnit priceUnit;
    private LocalTime createTime;
    private LocalDate createDate;
    private LocalDate firstRegistrationDate;
    private Status status;
    private List<String> urlList;

}
