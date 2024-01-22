package pl.motobudzet.api.vehicle_brand.brand_enumerated;

enum ModelABARTH implements ModelEnumInterface {
    M124("124"), M500("500"), M595("595"), INNY("Inny"),
    M695("695"), GRANDE_PUNTO("Grande Punto"), PUNTO_EVO("Punto Evo");
    private final String modelName;
    ModelABARTH(String modelName) {
        this.modelName = modelName;
    }
    public String getModelName() {
        return modelName;
    }
}
