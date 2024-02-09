package pl.motobudzet.api.dto;

import lombok.*;
import pl.motobudzet.api.model.*;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Builder
public record AdvertisementDTO(
        UUID id,
        String name,
        String description,
        ModelDTO model,
        BrandDTO brand,
        FuelType fuelType,
        DriveType driveType,
        EngineType engineType,
        TransmissionType transmissionType,
        String vinNumber,
        Boolean accidentFree,
        String mainPhotoUrl,
        String user,
        CityDTO city,
        Long mileage,
        Long price,
        Long engineCapacity,
        Long engineHorsePower,
        Long productionDate,
        MileageUnit mileageUnit,
        PriceUnit priceUnit,
        LocalTime createTime,
        LocalDate createDate,
        LocalDate firstRegistrationDate,
        Status status,
        List<String> urlList
) {

}
