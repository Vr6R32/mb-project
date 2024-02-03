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

import static pl.motobudzet.api.infrastructure.mapper.BrandMapper.mapToBrandEntity;
import static pl.motobudzet.api.infrastructure.mapper.ModelMapper.mapToModelEntity;

public class AdvertisementMapper {

    private AdvertisementMapper() {
    }

    public static AdvertisementDTO mapToAdvertisementDTO(Advertisement adv, boolean includeImages) {

        AdvertisementDTO builder = AdvertisementDTO.builder()
                .id(adv.getId())
                .name(adv.getName())
                .description(adv.getDescription())
                .model(ModelMapper.mapToModelDTO(adv.getModel()))
                .brand(BrandMapper.mapToBrandDTO(adv.getBrand()))
                .fuelType(adv.getFuelType())
                .driveType(adv.getDriveType())
                .engineType(adv.getEngineType())
                .transmissionType(adv.getTransmissionType())
                .user(adv.getUser().getUsername())
                .city(CityMapper.mapToCityDTO(adv.getCity()))
                .mileage(adv.getMileage())
                .mileageUnit(adv.getMileageUnit())
                .price(adv.getPrice())
                .priceUnit(adv.getPriceUnit())
                .engineCapacity(adv.getEngineCapacity())
                .engineHorsePower(adv.getEngineHorsePower())
                .firstRegistrationDate(adv.getFirstRegistrationDate())
                .productionDate(adv.getProductionDate())
                .createDate(adv.getCreateDate().toLocalDate())
                .createTime(adv.getCreateDate().toLocalTime())
                .mainPhotoUrl(adv.getMainPhotoUrl())
                .status(adv.getStatus())
                .build();

        if (includeImages) {
            builder.setUrlList(adv.getImageUrls());
        }

        return builder;
    }

    public static Advertisement mapCreateAdvertisementRequestToEntity(AdvertisementRequest request, AppUser currentUser) {

        Brand brand = Brand.builder()
                .id(request.getBrandId())
                .name(request.getBrand())
                .build();

        Model model = Model.builder()
                .id(request.getModelId())
                .name(request.getModel())
                .brand(brand)
                .build();

        return Advertisement.builder()
                .name(request.getName())
                .description(request.getDescription())
                .model(model)
                .brand(brand)
                .fuelType(request.getFuelType())
                .driveType(request.getDriveType())
                .engineType(request.getEngineType())
                .transmissionType(request.getTransmissionType())
                .mileage(request.getMileage())
                .mileageUnit(request.getMileageUnit())
                .price(request.getPrice())
                .priceUnit(request.getPriceUnit())
                .engineCapacity(request.getEngineCapacity())
                .engineHorsePower(request.getEngineHorsePower())
                .firstRegistrationDate(request.getFirstRegistrationDate())
                .productionDate(request.getProductionDate())
                .user(currentUser)
                .imageUrls(new ArrayList<>())
                .status(Status.PENDING_VERIFICATION)
                .build();
    }

    public static void setAdvertisementByEditRequest(AdvertisementRequest request, Advertisement advertisement) {
        BrandDTO brand = BrandDTO.builder()
                .id(request.getBrandId())
                .name(request.getBrand())
                .build();

        ModelDTO model = ModelDTO.builder()
                .id(request.getModelId())
                .name(request.getModel())
                .brand(brand)
                .build();

        advertisement.setName(request.getName());
        advertisement.setDescription(request.getDescription());
        advertisement.setModel(mapToModelEntity(model));
        advertisement.setBrand(mapToBrandEntity(brand));
        advertisement.setFuelType(request.getFuelType());
        advertisement.setDriveType(request.getDriveType());
        advertisement.setEngineType(request.getEngineType());
        advertisement.setTransmissionType(request.getTransmissionType());
        advertisement.setMileage(request.getMileage());
        advertisement.setMileageUnit(request.getMileageUnit());
        advertisement.setPrice(request.getPrice());
        advertisement.setPriceUnit(request.getPriceUnit());
        advertisement.setEngineCapacity(request.getEngineCapacity());
        advertisement.setEngineHorsePower(request.getEngineHorsePower());
        advertisement.setFirstRegistrationDate(request.getFirstRegistrationDate());
        advertisement.setProductionDate(request.getProductionDate());
        advertisement.setStatus(Status.PENDING_VERIFICATION);
    }
}
