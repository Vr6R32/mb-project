package pl.motobudzet.api.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum FuelType {
    LPG("LPG"),
    PB("PB"),
    ON("ON"),
    EV("EV"),
    PHEV("PHEV");

    @JsonValue
    private final String name;

    FuelType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
