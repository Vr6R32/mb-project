# Użyj oficjalnego obrazu OpenJDK 17 jako bazowego
FROM openjdk:17-jdk-slim

# Zmienna ARG dla nazwy pliku JAR; możesz dostosować tę wartość w trakcie budowy obrazu
ARG JAR_FILE=target/*.jar

# Skopiuj plik JAR aplikacji do obrazu w lokalizacji /app/app.jar
COPY ${JAR_FILE} app.jar


# Uruchamiaj aplikację
ENTRYPOINT ["java","-jar","/app.jar"]