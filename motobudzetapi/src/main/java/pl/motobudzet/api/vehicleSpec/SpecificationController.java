package pl.motobudzet.api.vehicleSpec;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.vehicleSpec.model.DriveType;
import pl.motobudzet.api.vehicleSpec.model.EngineType;
import pl.motobudzet.api.vehicleSpec.model.FuelType;
import pl.motobudzet.api.vehicleSpec.model.TransmissionType;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/spec")
public class SpecificationController {

    @GetMapping("/driveTypes")
    public List<Map<String, String>> getDriveTypes() {
        return Arrays.stream(DriveType.values())
                .map(driveType -> Map.of("name", driveType.getName()))
                .toList();
    }

    @GetMapping("/engineTypes")
    public List<Map<String, String>> getEngineTypes() {
        return Arrays.stream(EngineType.values())
                .map(engineType -> Map.of("name", engineType.getName()))
                .toList();
    }

    @GetMapping("/fuelTypes")
    public List<Map<String, String>> getFuelTypes() {
        return Arrays.stream(FuelType.values())
                .map(fuelType -> Map.of("name", fuelType.getName()))
                .toList();
    }

    @GetMapping("/transmissionTypes")
    public List<Map<String, String>> getTransmissionTypes() {
        return Arrays.stream(TransmissionType.values())
                .map(transmissionType -> Map.of("name", transmissionType.getName()))
                .toList();
    }
}
