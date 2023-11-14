package pl.motobudzet.api.advertisement.dto;

import lombok.*;


@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class AdvertisementFilterRequest {

    private Integer pageNumber;
    private Integer distanceFrom;
    private String brand;
    private String model;
    private String fuelType;
    private String driveType;
    private String engineType;
    private String transmissionType;
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
}
