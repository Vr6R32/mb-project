package pl.motobudzet.api.domain.advertisement.dto;

import lombok.*;
import pl.motobudzet.api.domain.advertisement.model.DriveType;
import pl.motobudzet.api.domain.advertisement.model.EngineType;
import pl.motobudzet.api.domain.advertisement.model.FuelType;
import pl.motobudzet.api.domain.advertisement.model.TransmissionType;


@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class AdvertisementFilterRequest {

    private Integer pageNumber;
    private Integer distanceFrom;
    private String title;
    private String brand;
    private String model;
    private FuelType fuelType;
    private DriveType driveType;
    private EngineType engineType;
    private TransmissionType transmissionType;
    private String city;
    private String cityState;
    private Long priceMin;
    private Long priceMax;
    private Long mileageFrom;
    private Long mileageTo;
    private Long engineCapacityFrom;
    private Long engineCapacityTo;
    private Long engineHorsePowerFrom;
    private Long engineHorsePowerTo;
    private Long productionDateFrom;
    private Long productionDateTo;
    private Boolean accidentFree;
}
