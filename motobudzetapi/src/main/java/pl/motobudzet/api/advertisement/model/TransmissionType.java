package pl.motobudzet.api.advertisement.model;

import com.fasterxml.jackson.annotation.JsonValue;


public enum TransmissionType {
    MANUAL("MANUAL"),
    AUTOMAT("AUTOMAT");

    @JsonValue
    private final String name;

    TransmissionType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}