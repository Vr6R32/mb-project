package pl.motobudzet.api.zconfiguration.jpa;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Converter(autoApply = true)
public class LocalDateTimeConverter implements AttributeConverter<LocalDateTime, LocalDateTime> {

    private static final ZoneId DB_ZONE_ID = ZoneId.of("UTC");
    private static final ZoneId APPLICATION_ZONE_ID = ZoneId.of("Europe/Warsaw");

    @Override
    public LocalDateTime convertToDatabaseColumn(LocalDateTime attribute) {
        return attribute == null ? null : attribute.atZone(APPLICATION_ZONE_ID).withZoneSameInstant(DB_ZONE_ID).toLocalDateTime();
    }

    @Override
    public LocalDateTime convertToEntityAttribute(LocalDateTime dbData) {
        return dbData == null ? null : dbData.atZone(DB_ZONE_ID).withZoneSameInstant(APPLICATION_ZONE_ID).toLocalDateTime();
    }
}