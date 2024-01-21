package pl.motobudzet.api.advertisement.dto;

import lombok.*;
import pl.motobudzet.api.advertisement.model.MileageUnit;
import pl.motobudzet.api.advertisement.model.PriceUnit;
import pl.motobudzet.api.advertisement.model.Status;
import pl.motobudzet.api.vehicleSpec.model.FuelType;

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
    private String model;
    private String brand;
    private FuelType fuelType;
    private String driveType;
    private String engineType;
    private String transmissionType;
    private String mainPhotoUrl;
    private String user;
    private String city;
    private String cityState;
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
