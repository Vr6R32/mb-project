package pl.motobudzet.api.advertisement.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EngineType {
    RZĘDOWY("RZĘDOWY"),
    WIDLASTY("WIDLASTY"),
    WANKEL("WANKEL"),
    ELEKTRYCZNY("ELEKTRYCZNY");

    @JsonValue
    private final String name;

    EngineType(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
