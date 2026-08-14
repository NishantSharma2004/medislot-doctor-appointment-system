FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
ENV MAVEN_OPTS="-Xmx256m"

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package application
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user and group
RUN addgroup -S medislot && adduser -S medislot -G medislot
USER medislot:medislot

# Copy built JAR from builder stage
COPY --from=builder /app/target/doctor-appointment-backend-*.jar app.jar

# Environment variables optimized for Render 512MB RAM free tier & IPv4 networking
ENV PORT=8080 \
    JAVA_OPTS="-Xms96m -Xmx220m -XX:MaxMetaspaceSize=110m -XX:ReservedCodeCacheSize=48m -Xss256k -XX:TieredStopAtLevel=1 -XX:+UseSerialGC -Dspring.backgroundpreinitializer.ignore=true -Djava.net.preferIPv4Stack=true"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
