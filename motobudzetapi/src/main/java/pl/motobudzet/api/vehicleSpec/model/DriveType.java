package pl.motobudzet.api.vehicleSpec.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum DriveType {
    AWD("AWD"),
    FWD("FWD"),
    RWD("RWD");

    @JsonValue
    private final String name;

    DriveType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
