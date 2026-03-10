# BUILD STAGE
FROM rust:1.89-slim-bookworm as builder

WORKDIR /app

# Install native dependencies required by some Rust crates (like OpenSSL and pkg-config)
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev build-essential libudev-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy the entire project
COPY . .

# Build the backend application
RUN cargo build --release -p mega-cripto-uai

# RUNTIME STAGE
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies (OpenSSL and CA certificates for HTTPS requests)
RUN apt-get update && \
    apt-get install -y ca-certificates libssl3 && \
    rm -rf /var/lib/apt/lists/*

# Copy the built binary from the builder stage
COPY --from=builder /app/target/release/mega-cripto-uai /app/mega-cripto-uai

# Cloud Run injects the PORT environment variable
ENV PORT=8080
EXPOSE 8080

CMD ["./mega-cripto-uai"]
