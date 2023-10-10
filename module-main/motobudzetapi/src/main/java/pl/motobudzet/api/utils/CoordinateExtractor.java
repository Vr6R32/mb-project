package pl.motobudzet.api.utils;

import pl.motobudzet.api.locationCity.entity.City;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CoordinateExtractor {

    public static List<City> extractCoordinates() {
        String filePath = "C:\\moto-budzet\\module-main\\motobudzetapi\\src\\main\\java\\pl\\motobudzet\\api\\utils\\properCities.txt";

        List<City> cityList = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String linia;
            while ((linia = br.readLine()) != null) {
                // Podziel linię na słowa, używając spacji jako separatora
                String[] words = linia.split("\\s+");

                // Sprawdź, czy linia ma co najmniej 3 słowa
                if (words.length >= 3) {
                    // Nazwa miasta może zawierać kilka słów, więc połączmy je
                    StringBuilder cityBuilder = new StringBuilder();
                    for (int i = 0; i < words.length - 2; i++) {
                        cityBuilder.append(words[i]).append(" ");
                    }
                    String city = cityBuilder.toString().trim();

                    String n_latitude = words[words.length - 1];
                    String e_longitude = words[words.length - 2];

                    n_latitude = n_latitude.replace("N", "").replace(",",".");
                    e_longitude = e_longitude.replace("E", "").replace(",",".");

                    City build = City.builder()
                            .name(city)
                            .eLongitude(Double.valueOf(e_longitude))
                            .nLatitude(Double.valueOf(n_latitude))
                            .build();

                    cityList.add(build);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return cityList;
    }
}