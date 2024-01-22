package pl.motobudzet.api.advertisement.model;

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
