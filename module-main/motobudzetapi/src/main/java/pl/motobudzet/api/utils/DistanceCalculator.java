package pl.motobudzet.api.utils;


public class DistanceCalculator {

    // Średni promień Ziemi w kilometrach
    private static final double EARTH_RADIUS_KM = 6371.0;

    // Oblicza odległość między dwoma punktami na Ziemi używając wzoru Haversine
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        // Zamiana stopni na radiany
        lat1 = Math.toRadians(lat1);
        lon1 = Math.toRadians(lon1);
        lat2 = Math.toRadians(lat2);
        lon2 = Math.toRadians(lon2);

        // Różnica szerokości i długości geograficznej
        double dLat = lat2 - lat1;
        double dLon = lon2 - lon1;

        // Obliczenia wzoru Haversine
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(lat1) * Math.cos(lat2)
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Odległość w kilometrach

        return EARTH_RADIUS_KM * c;
    }

}