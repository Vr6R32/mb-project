package pl.motobudzet.api.vehicleBrand.brand_enumerated;

enum ModelBMW implements ModelEnumInterface {
    SERIES_3, SERIES_5;

    public String getModelName() {
        return name().replace("_", " ");
    }
}