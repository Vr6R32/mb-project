package pl.motobudzet.api.thymeleaf;

import pl.motobudzet.api.advertisement.model.MileageUnit;
import pl.motobudzet.api.advertisement.model.PriceUnit;

public record MetaDataDTO(String title, String miniatureUrl, Long price, PriceUnit priceUnit, Long mileage, MileageUnit mileageUnit) {

}