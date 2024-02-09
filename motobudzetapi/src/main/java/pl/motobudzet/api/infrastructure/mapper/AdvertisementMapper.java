package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.domain.advertisement.dto.AdvertisementRequest;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;
import pl.motobudzet.api.domain.advertisement.model.Status;
import pl.motobudzet.api.domain.brand.Brand;
import pl.motobudzet.api.domain.brand.BrandDTO;
import pl.motobudzet.api.domain.model.Model;
import pl.motobudzet.api.domain.model.ModelDTO;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.ArrayList;
import java.util.List;

import static pl.motobudzet.api.infrastructure.mapper.BrandMapper.mapToBrandEntity;
import static pl.motobudzet.api.infrastructure.mapper.ModelMapper.mapToModelEntity;

public class AdvertisementMapper {

    private AdvertisementMapper() {
    }

    public static AdvertisementDTO mapToAdvertisementDTO(Advertisement adv, boolean includeImages) {
        List<String> urlList = includeImages ? adv.getImageUrls() : List.of();

        return new AdvertisementDTO(
                adv.getId(),
                adv.getName(),
                adv.getDescription(),
                ModelMapper.mapToModelDTO(adv.getModel()),
                BrandMapper.mapToBrandDTO(adv.getBrand()),
                adv.getFuelType(),
                adv.getDriveType(),
                adv.getEngineType(),
                adv.getTransmissionType(),
                adv.getVinNumber(),
                adv.isAccidentFree(),
                adv.getMainPhotoUrl(),
                adv.getUser().getUsername(),
                CityMapper.mapToCityDTO(adv.getCity()),
                adv.getMileage(),
                adv.getPrice(),
                adv.getEngineCapacity(),
                adv.getEngineHorsePower(),
                adv.getProductionDate(),
                adv.getMileageUnit(),
                adv.getPriceUnit(),
                adv.getCreateDate().toLocalTime(),
                adv.getCreateDate().toLocalDate(),
                adv.getFirstRegistrationDate(),
                adv.getStatus(),
                urlList
        );
    }

    public static Advertisement mapCreateAdvertisementRequestToEntity(AdvertisementRequest request, AppUser currentUser) {

        Brand brand = Brand.builder()
                .id(request.brandId())
                .name(request.brand())
                .build();

        Model model = Model.builder()
                .id(request.modelId())
                .name(request.model())
                .brand(brand)
                .build();

        return Advertisement.builder()
                .name(request.name())
                .description(request.description())
                .model(model)
                .brand(brand)
                .vinNumber(request.vinNumber())
                .fuelType(request.fuelType())
                .driveType(request.driveType())
                .engineType(request.engineType())
                .transmissionType(request.transmissionType())
                .mileage(request.mileage())
                .mileageUnit(request.mileageUnit())
                .price(request.price())
                .priceUnit(request.priceUnit())
                .engineCapacity(request.engineCapacity())
                .engineHorsePower(request.engineHorsePower())
                .firstRegistrationDate(request.firstRegistrationDate())
                .productionDate(request.productionDate())
                .user(currentUser)
                .imageUrls(new ArrayList<>())
                .status(Status.PENDING_VERIFICATION)
                .build();
    }

    public static void setAdvertisementByEditRequest(AdvertisementRequest request, Advertisement advertisement) {

        BrandDTO brand = BrandDTO.builder()
                .id(request.brandId())
                .name(request.brand())
                .build();

        ModelDTO model = ModelDTO.builder()
                .id(request.modelId())
                .name(request.model())
                .brand(brand)
                .build();

        advertisement.setName(request.name());
        advertisement.setDescription(request.description());
        advertisement.setModel(mapToModelEntity(model));
        advertisement.setBrand(mapToBrandEntity(brand));
        advertisement.setVinNumber(request.vinNumber());
        advertisement.setAccidentFree(request.accidentFree());
        advertisement.setFuelType(request.fuelType());
        advertisement.setDriveType(request.driveType());
        advertisement.setEngineType(request.engineType());
        advertisement.setTransmissionType(request.transmissionType());
        advertisement.setMileage(request.mileage());
        advertisement.setMileageUnit(request.mileageUnit());
        advertisement.setPrice(request.price());
        advertisement.setPriceUnit(request.priceUnit());
        advertisement.setEngineCapacity(request.engineCapacity());
        advertisement.setEngineHorsePower(request.engineHorsePower());
        advertisement.setFirstRegistrationDate(request.firstRegistrationDate());
        advertisement.setProductionDate(request.productionDate());
        advertisement.setStatus(Status.PENDING_VERIFICATION);
    }
}
