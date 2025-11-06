FROM python:3.14.0-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/root/.local/bin:${PATH}"

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    bash \
    postgresql-client \
    gcc \
    musl-dev \
    postgresql-dev \
    netcat-openbsd \
    curl \
    libffi-dev \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Install UV (blazing fast Python package installer)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Copy requirements
COPY requirements.txt /app/

# Install Python dependencies with UV (10-100x faster than pip!)
RUN uv pip install --system -r requirements.txt

# Copy project
COPY . /app/

# Run entrypoint script
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
