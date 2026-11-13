FROM eclipse-temurin:24-jdk AS build
WORKDIR /app

COPY gradlew ./
COPY gradle gradle
COPY settings.gradle* build.gradle ./
RUN chmod +x gradlew && ./gradlew --no-daemon dependencies || true

COPY src src
RUN ./gradlew --no-daemon bootJar -x test

FROM eclipse-temurin:24-jre
WORKDIR /app
RUN useradd -r -u 1001 app && chown -R app /app
COPY --from=build /app/build/libs/*.jar app.jar
USER app
EXPOSE 8080
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75","-jar","app.jar"]