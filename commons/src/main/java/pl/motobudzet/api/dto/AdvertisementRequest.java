package pl.motobudzet.api.dto;


import jakarta.validation.constraints.*;
import pl.motobudzet.api.model.*;


import java.time.LocalDate;

public record AdvertisementRequest(
        @Size(min = 2, max = 32, message = "Title must be between 2 and 32 characters long") String name,
        @NotEmpty(message = "Description cannot be empty!") String description,
        @NotEmpty(message = "Model cannot be empty!") String model,
        @Pattern(regexp = "^$|.{17}", message = "Vin must be exactly 17 characters or empty") String vinNumber,
        @NotNull(message = "Please specify the accident history.") Boolean accidentFree,
        @NotNull(message = "Model id cannot be empty!") Long modelId,
        @NotEmpty(message = "Brand cannot be empty!") String brand,
        @NotNull(message = "Brand id cannot be empty!") Long brandId,
        @NotNull(message = "Fuel type cannot be empty!") FuelType fuelType,
        @NotNull(message = "Drive type cannot be empty!") DriveType driveType,
        @NotNull(message = "Engine type cannot be empty!") EngineType engineType,
        @NotNull(message = "Transmission type cannot be empty!") TransmissionType transmissionType,
        @NotNull(message = "Mileage cannot be empty!") Long mileage,
        @NotNull(message = "Mileage unit cannot be empty!") MileageUnit mileageUnit,
        @NotNull(message = "Price cannot be empty!") Long price,
        @NotNull(message = "Price unit cannot be empty!") PriceUnit priceUnit,
        @NotNull(message = "Engine capacity cannot be empty!") Long engineCapacity,
        @NotNull(message = "Engine horse power cannot be empty!") Long engineHorsePower,
        @NotNull(message = "Production date cannot be empty!") Long productionDate,
        @NotNull(message = "First registration date cannot be empty!") @Past(message = "First registration date has to be a date before today date!") LocalDate firstRegistrationDate,
        @NotNull(message = "City cannot be empty!") String city,
        @NotNull(message = "City state cannot be empty!") String cityState,
        @NotNull(message = "Main Photo cannot be empty!") String mainPhotoUrl
) {

}