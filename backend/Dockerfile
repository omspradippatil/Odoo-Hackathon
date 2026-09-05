# ==========================================
# Build Stage
# ==========================================
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and compile
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# Production Runtime Stage
# ==========================================
FROM eclipse-temurin:17-jre-alpine AS runner

WORKDIR /app

# Run as non-root user for security best practices
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy built artifact from builder stage
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

EXPOSE 8080

# JVM container-aware memory allocation flags
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java  -jar app.jar"]