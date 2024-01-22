package pl.motobudzet.api.vehicle_brand.brand_enumerated;

enum ModelAUDI implements ModelEnumInterface {
    A3, A4, A6;

    public String getModelName() {
        return name();
    }
}