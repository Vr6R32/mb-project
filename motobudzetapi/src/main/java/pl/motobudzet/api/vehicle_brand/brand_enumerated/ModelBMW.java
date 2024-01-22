package pl.motobudzet.api.vehicle_brand.brand_enumerated;

enum ModelBMW implements ModelEnumInterface {
    SERIES_3, SERIES_5;

    public String getModelName() {
        return name().replace("_", " ");
    }
}