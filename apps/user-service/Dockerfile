FROM eclipse-temurin:17-jre-jammy

WORKDIR /app
COPY docker-build/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
