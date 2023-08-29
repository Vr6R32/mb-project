package pl.motobudzet.api.advertisement.dto;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class AdvertisementCreateRequest {

    @Size(min = 5, max = 32, message = "Title must be between 2 and 32 characters long")
    private String name;
    @NotEmpty(message = "Description cannot be empty!")
    private String description;
    @NotEmpty(message = "Model cannot be empty!")
    private String model;
    @NotEmpty(message = "Brand cannot be empty!")
    private String brand;
    @NotEmpty(message = "Fuel type cannot be empty!")
    private String fuelType;
    @NotEmpty(message = "Drive type cannot be empty!")
    private String driveType;
    @NotEmpty(message = "Engine type cannot be empty!")
    private String engineType;
    @NotEmpty(message = "Transmission type cannot be empty!")
    private String transmissionType;
    @NotNull(message = "Mileage cannot be empty!")
    private Long mileage;
    @NotNull(message = "Price cannot be empty!")
    private Long price;
    @NotNull(message = "Engine capacity cannot be empty!")
    private Long engineCapacity;
    @NotNull(message = "Engine horse power cannot be empty!")
    private Long engineHorsePower;
    @NotNull(message = "Production date cannot be empty!")
    private Long productionDate;
    @NotNull(message = "First registration date cannot be empty!")
    @Past(message = "First registration date has to be a date before today date!")
    private LocalDate firstRegistrationDate;

}
