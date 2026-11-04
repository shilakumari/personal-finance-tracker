FROM eclipse-temurin:25-jdk AS build

WORKDIR /workspace
COPY server/.mvn/ .mvn/
COPY server/mvnw server/pom.xml ./
COPY server/src/ src/
RUN chmod +x mvnw && ./mvnw -B -DskipTests package

FROM eclipse-temurin:25-jre

WORKDIR /app
RUN groupadd --system --gid 10001 app && useradd --system --uid 10001 --gid app app
COPY --from=build --chown=app:app /workspace/target/*.jar app.jar
USER app

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]