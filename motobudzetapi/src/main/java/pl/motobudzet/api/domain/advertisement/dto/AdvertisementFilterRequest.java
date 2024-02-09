package pl.motobudzet.api.domain.advertisement.dto;

import pl.motobudzet.api.domain.advertisement.model.DriveType;
import pl.motobudzet.api.domain.advertisement.model.EngineType;
import pl.motobudzet.api.domain.advertisement.model.FuelType;
import pl.motobudzet.api.domain.advertisement.model.TransmissionType;


public record AdvertisementFilterRequest(
        Integer pageNumber,
        Integer distanceFrom,
        String title,
        String brand,
        String model,
        FuelType fuelType,
        DriveType driveType,
        EngineType engineType,
        TransmissionType transmissionType,
        String city,
        String cityState,
        Long priceMin,
        Long priceMax,
        Long mileageFrom,
        Long mileageTo,
        Long engineCapacityFrom,
        Long engineCapacityTo,
        Long engineHorsePowerFrom,
        Long engineHorsePowerTo,
        Long productionDateFrom,
        Long productionDateTo,
        Boolean accidentFree
) {

}
