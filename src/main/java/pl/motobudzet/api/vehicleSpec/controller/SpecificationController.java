package pl.motobudzet.api.vehicleSpec.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.vehicleSpec.entity.DriveType;
import pl.motobudzet.api.vehicleSpec.entity.EngineType;
import pl.motobudzet.api.vehicleSpec.entity.FuelType;
import pl.motobudzet.api.vehicleSpec.entity.TransmissionType;
import pl.motobudzet.api.vehicleSpec.service.SpecificationService;

import java.util.List;

@RestController
@RequestMapping("api/spec")
public class SpecificationController {

    private final SpecificationService specificationService;

    public SpecificationController(SpecificationService specificationService) {
        this.specificationService = specificationService;
    }

    @GetMapping("/driveTypes")
    public List<DriveType> getDriveTypes(){
        return specificationService.getDriveTypes();
    }
    @GetMapping("/engineTypes")
    public List<EngineType> getEngineTypes(){
        return specificationService.getEngineTypes();
    }
    @GetMapping("/fuelTypes")
    public List<FuelType> getFuelTypes(){
        return specificationService.getFuelTypes();
    }
    @GetMapping("/transmissionTypes")
    public List<TransmissionType> getTransmissionTypes(){
        return specificationService.getTransmissionTypes();
    }
}
