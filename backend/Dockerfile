# BUILD STAGE
FROM rust:1.80-slim-bookworm as builder

WORKDIR /app

# Install native dependencies required by some Rust crates (like OpenSSL and pkg-config)
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev build-essential libudev-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy the manifest files
COPY Cargo.toml Cargo.lock ./

# Create a dummy src/main.rs to build dependencies and cache them
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Now copy the actual source code
COPY ./src ./src

# Build the real application
RUN touch src/main.rs && cargo build --release

# RUNTIME STAGE
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies (OpenSSL and CA certificates for HTTPS requests)
RUN apt-get update && \
    apt-get install -y ca-certificates libssl3 && \
    rm -rf /var/lib/apt/lists/*

# Copy the built binary from the builder stage
COPY --from=builder /app/target/release/lottery-backend /app/lottery-backend

# Cloud Run injects the PORT environment variable
ENV PORT=8080
EXPOSE 8080

CMD ["./lottery-backend"]
