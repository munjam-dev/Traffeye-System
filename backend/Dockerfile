FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgthread-2.0-0 \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p uploads/videos uploads/violations ai_module/models

# Copy application code
COPY . .

# Download YOLOv8 model
RUN python -c " \
from ultralytics import YOLO; \
import os; \
os.makedirs('ai_module/models', exist_ok=True); \
model = YOLO('yolov8n.pt'); \
model.save('ai_module/models/yolov8n.pt'); \
print('YOLOv8 model downloaded successfully!'); \
"

# Create non-root user
RUN useradd -m -u 1000 traffeye && \
    chown -R traffeye:traffeye /app
USER traffeye

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
