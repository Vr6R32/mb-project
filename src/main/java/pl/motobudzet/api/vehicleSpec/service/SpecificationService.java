package pl.motobudzet.api.vehicleSpec.service;

import org.springframework.stereotype.Service;
import pl.motobudzet.api.vehicleSpec.entity.DriveType;
import pl.motobudzet.api.vehicleSpec.entity.EngineType;
import pl.motobudzet.api.vehicleSpec.entity.FuelType;
import pl.motobudzet.api.vehicleSpec.entity.TransmissionType;
import pl.motobudzet.api.vehicleSpec.repository.DriveTypeRepository;
import pl.motobudzet.api.vehicleSpec.repository.EngineTypeRepository;
import pl.motobudzet.api.vehicleSpec.repository.FuelTypeRepository;
import pl.motobudzet.api.vehicleSpec.repository.TransmissionTypeRepository;

import java.util.List;



@Service
public class SpecificationService {

    private final DriveTypeRepository driveTypeRepository;
    private final EngineTypeRepository engineTypeRepository;
    private final FuelTypeRepository fuelTypeRepository;
    private final TransmissionTypeRepository transmissionTypeRepository;

    public SpecificationService(DriveTypeRepository driveTypeRepository, EngineTypeRepository engineTypeRepository, FuelTypeRepository fuelTypeRepository, TransmissionTypeRepository transmissionTypeRepository) {
        this.driveTypeRepository = driveTypeRepository;
        this.engineTypeRepository = engineTypeRepository;
        this.fuelTypeRepository = fuelTypeRepository;
        this.transmissionTypeRepository = transmissionTypeRepository;
    }

    public List<DriveType> getDriveTypes() {
        return driveTypeRepository.findAllCached();
    }

    public List<EngineType> getEngineTypes() {
        return engineTypeRepository.findAllCached();
    }

    public List<FuelType> getFuelTypes() {
        return fuelTypeRepository.findAllCached();
    }

    public List<TransmissionType> getTransmissionTypes() {
        return transmissionTypeRepository.findAllCached();
    }
}
