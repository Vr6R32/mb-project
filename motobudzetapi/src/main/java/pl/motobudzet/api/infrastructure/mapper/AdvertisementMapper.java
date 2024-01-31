package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;

public class AdvertisementMapper {

    private AdvertisementMapper() {
    }

    public static AdvertisementDTO mapToAdvertisementDTO(Advertisement adv, boolean includeImageUrls) {

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
                .cityState(CityStateMapper.mapToCityStateDTO(adv.getCity().getCityState()))
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

        if (includeImageUrls) {
            builder.setUrlList(adv.getImageUrls());
        }

        return builder;
    }
}
