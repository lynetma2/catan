# --- Build stage ---
FROM eclipse-temurin:24-jdk AS build
WORKDIR /app

# Install Gradle 8.14 (required for Java 24 support)
RUN apt-get update && apt-get install -y wget unzip && \
    wget -q https://services.gradle.org/distributions/gradle-8.14-bin.zip && \
    unzip -q gradle-8.14-bin.zip -d /opt && \
    rm gradle-8.14-bin.zip
ENV PATH="/opt/gradle-8.14/bin:${PATH}"

COPY . .
RUN gradle bootJar --no-daemon

# --- Run stage ---
# Using standard JRE (Debian-based) because Alpine images for Java 24
# are sometimes delayed or missing on Docker Hub.
FROM eclipse-temurin:24-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
RUN mkdir -p /data
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]