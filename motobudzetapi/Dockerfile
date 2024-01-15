
# Use the official OpenJDK 17 image as the base
FROM maven:3.8.4-openjdk-17 as builder

WORKDIR /app

RUN mkdir -p /app/module-main/files/public && \
    chmod 777 /app/module-main/files/public

RUN mkdir -p /app/module-main/files/private && \
    chmod 777 /app/module-main/files/private

ARG JAR_FILE=/motobudzetapi/target/*.jar

COPY ${JAR_FILE} app.jar

EXPOSE 20134

ENTRYPOINT ["java","-jar","/app/app.jar"]