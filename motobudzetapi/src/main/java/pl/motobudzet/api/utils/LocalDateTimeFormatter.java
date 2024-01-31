package pl.motobudzet.api.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class LocalDateTimeFormatter {
    private LocalDateTimeFormatter() {
    }

    public static String formatDate(LocalDateTime messageDateTime) {
        LocalDate date = messageDateTime.toLocalDate();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        return date.format(dateFormatter);
    }

    public static String formatTime(LocalDateTime messageDateTime) {
        LocalTime time = messageDateTime.toLocalTime();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        return time.format(timeFormatter);
    }
}
