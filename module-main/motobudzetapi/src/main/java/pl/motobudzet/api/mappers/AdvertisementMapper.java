package pl.motobudzet.api.mappers;

import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.entity.Advertisement;

public class AdvertisementMapper {

    private AdvertisementMapper() {
    }

    public static AdvertisementDTO mapToAdvertisementDTO(Advertisement adv, boolean includeImageUrls) {

        AdvertisementDTO builder = AdvertisementDTO.builder()
                .id(adv.getId().toString())
                .name(adv.getName())
                .description(adv.getDescription())
                .model(adv.getModel().getName())
                .brand(adv.getBrand().getName())
                .fuelType(adv.getFuelType().getName())
                .driveType(adv.getDriveType().getName())
                .engineType(adv.getEngineType().getName())
                .transmissionType(adv.getTransmissionType().getName())
                .user(adv.getUser().getUsername())
                .city(adv.getCity().getName())
                .cityState(adv.getCity().getCityState().getName())
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
                .isDeleted(adv.isDeleted())
                .isVerified(adv.isVerified())
                .isActive(adv.isActive())
                .build();

        if (includeImageUrls) {
            builder.setUrlList(adv.getImageUrls());
        }

        return builder;
    }
}
