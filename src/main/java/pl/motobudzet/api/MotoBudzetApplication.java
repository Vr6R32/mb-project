package pl.motobudzet.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class MotoBudzetApplication {

    public static void main(String[] args) {
        SpringApplication.run(MotoBudzetApplication.class, args);
    }

}
