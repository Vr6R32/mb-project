package pl.motobudzet.api.adapter.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.model.DriveType;
import pl.motobudzet.api.model.EngineType;
import pl.motobudzet.api.model.FuelType;
import pl.motobudzet.api.model.TransmissionType;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/spec")
class AdvertisementSpecificationController {

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
