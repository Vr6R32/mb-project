package pl.motobudzet.api.infrastructure.thymeleaf;

import pl.motobudzet.api.domain.advertisement.model.MileageUnit;
import pl.motobudzet.api.domain.advertisement.model.PriceUnit;

public record MetaDataDTO(String title, String miniatureUrl, Long price, PriceUnit priceUnit, Long mileage, MileageUnit mileageUnit) {

}