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

    public FuelType getFuelType(String fuelType) {
        return fuelTypeRepository.findByNejm(fuelType.toUpperCase()).orElseThrow(() -> new RuntimeException("wrong fuel !"));
    }
    public EngineType getEngineType(String engineType) {
        return engineTypeRepository.findByNejm(engineType).orElseThrow(() -> new RuntimeException("wrong engine !"));
    }
    public DriveType getDriveType(String driveType) {
        return driveTypeRepository.findByNejm(driveType.toUpperCase()).orElseThrow(() -> new RuntimeException("wrong drive !"));
    }
    public TransmissionType getTransmissionType(String transmissionType) {
        return transmissionTypeRepository.findByNejm(transmissionType).orElseThrow(() -> new RuntimeException("wrong transmission !"));
    }

    public String getFuelType(Long fuelTypeId) {
        FuelType fuelType = fuelTypeRepository.findByAjdi(fuelTypeId).orElseThrow(() -> new RuntimeException("wrong fuel !"));
        return fuelType.getName();
    }
    public String getEngineType(Long engineTypeId) {
        EngineType engineType = engineTypeRepository.findByAjdi(engineTypeId).orElseThrow(() -> new RuntimeException("wrong engine !"));
        return engineType.getName();
    }
    public String getDriveType(Long driveTypeId) {
        DriveType driveType = driveTypeRepository.findByAjdi(driveTypeId).orElseThrow(() -> new RuntimeException("wrong drive !"));
        return driveType.getName();
    }
    public String getTransmissionType(Long transmissionTypeId) {
        TransmissionType transmissionType = transmissionTypeRepository.findByAjdi(transmissionTypeId).orElseThrow(() -> new RuntimeException("wrong transmission !"));
        return transmissionType.getName();
    }


}
