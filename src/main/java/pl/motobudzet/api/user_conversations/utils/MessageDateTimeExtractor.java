package pl.motobudzet.api.user_conversations.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class MessageDateTimeExtractor {
    private MessageDateTimeExtractor() {
    }

    public static String extractDate(LocalDateTime messageDateTime){
        LocalDate date = messageDateTime.toLocalDate();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        return date.format(dateFormatter);

    }
    public static String extractTime(LocalDateTime messageDateTime){
        LocalTime time = messageDateTime.toLocalTime();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        return time.format(timeFormatter);
    }
}
