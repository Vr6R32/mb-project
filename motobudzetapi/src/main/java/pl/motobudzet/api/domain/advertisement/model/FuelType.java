package pl.motobudzet.api.domain.advertisement.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum FuelType {
    LPG("LPG"),
    BENZYNA("BENZYNA"),
    DIESEL("DIESEL"),
    ELEKTRYCZNY("ELEKTRYCZNY"),
    HYBRYDA("HYBRYDA");

    @JsonValue
    private final String name;

    FuelType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}