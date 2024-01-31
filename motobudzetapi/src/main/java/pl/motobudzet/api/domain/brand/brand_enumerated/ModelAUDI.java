package pl.motobudzet.api.domain.brand.brand_enumerated;

enum ModelAUDI implements ModelEnumInterface {
    A3, A4, A6;

    public String getModelName() {
        return name();
    }
}