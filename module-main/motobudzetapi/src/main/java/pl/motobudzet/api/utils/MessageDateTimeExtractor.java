package pl.motobudzet.api.utils;

        import java.time.LocalDate;
        import java.time.LocalDateTime;
        import java.time.LocalTime;

public class MessageDateTimeExtractor {
    private MessageDateTimeExtractor() {
    }

    public static LocalDate extractDate(LocalDateTime messageDateTime) {
//        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
//        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        return messageDateTime.toLocalDate();
    }

    public static LocalTime extractTime(LocalDateTime messageDateTime) {
        return messageDateTime.toLocalTime().withNano(0);
    }
}

