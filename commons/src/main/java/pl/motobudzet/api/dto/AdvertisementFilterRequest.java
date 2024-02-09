package pl.motobudzet.api.dto;


import pl.motobudzet.api.model.DriveType;
import pl.motobudzet.api.model.EngineType;
import pl.motobudzet.api.model.FuelType;
import pl.motobudzet.api.model.TransmissionType;

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
