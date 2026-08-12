#Build the JAR
FROM gradle:8-jdk21 AS build
WORKDIR /home/gradle/project
COPY --chown=gradle:gradle . .
RUN gradle bootJar --no-daemon
LABEL authors="99sun"

# Run the JAR
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /home/gradle/project/build/libs/*.jar app.jar

# Create the dir for the SQLite volume
RUN mkdir -p /data

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]