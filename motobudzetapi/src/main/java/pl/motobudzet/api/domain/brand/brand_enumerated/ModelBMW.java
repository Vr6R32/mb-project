package pl.motobudzet.api.domain.brand.brand_enumerated;

enum ModelBMW implements ModelEnumInterface {
    SERIES_3, SERIES_5;

    public String getModelName() {
        return name().replace("_", " ");
    }
}