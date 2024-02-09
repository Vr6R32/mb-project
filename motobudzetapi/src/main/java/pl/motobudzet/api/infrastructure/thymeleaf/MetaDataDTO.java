package pl.motobudzet.api.infrastructure.thymeleaf;

import pl.motobudzet.api.model.MileageUnit;
import pl.motobudzet.api.model.PriceUnit;

public record MetaDataDTO(String title, String miniatureUrl, Long price, PriceUnit priceUnit, Long mileage, MileageUnit mileageUnit) {

}