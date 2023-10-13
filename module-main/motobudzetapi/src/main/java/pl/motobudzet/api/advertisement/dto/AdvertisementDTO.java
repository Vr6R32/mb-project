package pl.motobudzet.api.advertisement.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class AdvertisementDTO {

    private String id;
    private String name;
    private String description;
    private String model;
    private String brand;
    private String fuelType;
    private String driveType;
    private String engineType;
    private String transmissionType;
    private String mainPhotoUrl;
    private String mileageUnit;
    private String priceUnit;
    private String user;
    private String creationDate;
    private String creationTime;
    private String city;
    private String cityState;
    private Long mileage;
    private Long price;
    private Long engineCapacity;
    private Long engineHorsePower;
    private Long productionDate;
    private LocalDate firstRegistrationDate;
    private boolean isVerified;
    private List<String> urlList;

}
