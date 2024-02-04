package pl.motobudzet.api.domain.advertisement.dto;


import jakarta.validation.constraints.*;
import lombok.*;
import pl.motobudzet.api.domain.advertisement.model.MileageUnit;
import pl.motobudzet.api.domain.advertisement.model.PriceUnit;
import pl.motobudzet.api.domain.advertisement.model.DriveType;
import pl.motobudzet.api.domain.advertisement.model.EngineType;
import pl.motobudzet.api.domain.advertisement.model.FuelType;
import pl.motobudzet.api.domain.advertisement.model.TransmissionType;

import java.time.LocalDate;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class AdvertisementRequest {

    @Size(min = 2, max = 32, message = "Title must be between 2 and 32 characters long")
    private String name;
    @NotEmpty(message = "Description cannot be empty!")
    private String description;
    @NotEmpty(message = "Model cannot be empty!")
    private String model;
    @Pattern(regexp = "^$|.{17}", message = "Vin must be exactly 17 characters or empty")
    private String vinNumber;
    @NotNull(message = "Please specify the accident history.")
    private Boolean accidentFree;
    @NotNull(message = "Model id cannot be empty!")
    private Long modelId;
    @NotEmpty(message = "Brand cannot be empty!")
    private String brand;
    @NotNull(message = "Model id cannot be empty!")
    private Long brandId;
    @NotNull(message = "Fuel type cannot be empty!")
    private FuelType fuelType;
    @NotNull(message = "Drive type cannot be empty!")
    private DriveType driveType;
    @NotNull(message = "Engine type cannot be empty!")
    private EngineType engineType;
    @NotNull(message = "Transmission type cannot be empty!")
    private TransmissionType transmissionType;
    @NotNull(message = "Mileage cannot be empty!")
    private Long mileage;
    @NotNull(message = "Mileage cannot be empty!")
    private MileageUnit mileageUnit;
    @NotNull(message = "Price cannot be empty!")
    private Long price;
    @NotNull(message = "Price cannot be empty!")
    private PriceUnit priceUnit;
    @NotNull(message = "Engine capacity cannot be empty!")
    private Long engineCapacity;
    @NotNull(message = "Engine horse power cannot be empty!")
    private Long engineHorsePower;
    @NotNull(message = "Production date cannot be empty!")
    private Long productionDate;
    @NotNull(message = "First registration date cannot be empty!")
    @Past(message = "First registration date has to be a date before today date!")
    private LocalDate firstRegistrationDate;
    @NotNull(message = "City cannot be empty!")
    private String city;
    @NotNull(message = "City state cannot be empty!")
    private String cityState;
    @NotNull(message = "Main Photo cannot be empty!")
    private String mainPhotoUrl;
}
