package pl.motobudzet.api.vehicle_brand.brand_enumerated;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ModelEnumConverter implements AttributeConverter<ModelEnumInterface, String> {

    @Override
    public String convertToDatabaseColumn(ModelEnumInterface attribute) {
        return attribute != null ? attribute.getModelName() : null;
    }

    @Override
    public ModelEnumInterface convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }

        String[] parts = dbData.split("_");
        if (parts.length < 2) {
            return null; // lub rzucenie wyjątku
        }

        String brandName = parts[0];
        String modelName = parts[1];

        for (Brand brand : Brand.values()) {
            if (brand.getName().equalsIgnoreCase(brandName)) {
                for (Enum<? extends ModelEnumInterface> model : brand.getModelEnumClass().getEnumConstants()) {
                    if (model.name().equalsIgnoreCase(modelName)) {
                        return (ModelEnumInterface) model;
                    }
                }
            }
        }
        return null;
    }
}