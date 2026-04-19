FROM eclipse-temurin:24-jdk-alpine AS cache
WORKDIR /cache
# Copy the wrapper and configuration files
COPY ../../../Catan/gradlew .
COPY ../../../Catan/gradle gradle/
COPY ../../../Catan/build.gradle ../../../Catan/settings.gradle ./

# Ensure the wrapper has execution permissions
RUN chmod +x gradlew

# Use the wrapper to download dependencies
RUN ./gradlew dependencies --no-daemon --quiet

# Build stage
FROM eclipse-temurin:24-jdk-alpine AS build
WORKDIR /app

# Copy the cached dependencies from the previous stage
COPY --from=cache /root/.gradle /root/.gradle
COPY ../../../Catan/. .

# Ensure the wrapper is executable here as well
RUN chmod +x gradlew

# Build the jar using the wrapper
RUN ./gradlew bootJar --no-daemon -x test

# Run stage
FROM eclipse-temurin:24-jre-alpine AS runtime
ARG SPRING_PROFILE=prod
ENV SPRING_PROFILE_ACTIVE=${SPRING_PROFILE}
RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
USER spring
EXPOSE 8080
#For debugger
EXPOSE 5005
ENTRYPOINT if [ "$SPRING_PROFILES_ACTIVE" = "dev" ]; then \
    exec java \
      -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 \
      -XX:+UseContainerSupport \
      -XX:MaxRAMPercentage=75.0 \
      -jar app.jar; \
  else \
    exec java \
      -XX:+UseContainerSupport \
      -XX:MaxRAMPercentage=75.0 \
      -jar app.jar; \
  fi