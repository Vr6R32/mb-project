package pl.motobudzet.api.infrastructure.configuration;

import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;
import java.time.ZoneId;
import java.util.TimeZone;

@Configuration
public class TimeZoneConfig {
    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone(ZoneId.of("Europe/Warsaw")));
    }
}