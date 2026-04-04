#!/usr/bin/env python3
"""
TraffEye Backend Setup Script
Automatically installs dependencies and downloads AI models
"""

import os
import subprocess
import sys

def run_command(command, description):
    """Run command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return None

def check_python_version():
    """Check Python version"""
    print("🐍 Checking Python version...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required")
        print(f"Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def install_dependencies():
    """Install Python dependencies"""
    return run_command(
        "pip install -r requirements.txt",
        "Installing Python dependencies"
    )

def download_yolo_model():
    """Download YOLOv8 model"""
    print("\n🤖 Downloading YOLOv8 model...")
    
    # Create models directory
    os.makedirs("ai_module/models", exist_ok=True)
    
    # Download model using Python
    model_script = """
import os
from ultralytics import YOLO

# Create models directory
os.makedirs("ai_module/models", exist_ok=True)

# Download and save model
print("Downloading YOLOv8n model...")
model = YOLO('yolov8n.pt')
model.save('ai_module/models/yolov8n.pt')
print("✅ YOLOv8 model downloaded successfully!")
"""
    
    result = run_command(
        f"python -c \"{model_script}\"",
        "Downloading YOLOv8 model"
    )
    
    return result

def create_env_file():
    """Create .env file from example"""
    if not os.path.exists('.env'):
        if os.path.exists('.env.example'):
            run_command(
                "cp .env.example .env",
                "Creating .env file from example"
            )
            print("⚠️  Please edit .env file with your configuration")
        else:
            print("❌ .env.example file not found")
    else:
        print("✅ .env file already exists")

def test_ai_module():
    """Test AI module import"""
    test_script = """
try:
    from ai_module.traffic_detector import TrafficViolationDetector
    from ai_module.plate_recognition import NumberPlateRecognizer
    print("✅ AI modules imported successfully!")
    
    # Test detector initialization
    detector = TrafficViolationDetector()
    print("✅ Traffic detector initialized!")
    
    # Test plate recognizer
    plate_recognizer = NumberPlateRecognizer()
    print("✅ Plate recognizer initialized!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
except Exception as e:
    print(f"❌ Initialization error: {e}")
"""
    
    return run_command(
        f"python -c \"{test_script}\"",
        "Testing AI modules"
    )

def main():
    """Main setup function"""
    print("🚦 TraffEye Backend Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Failed to install dependencies")
        sys.exit(1)
    
    # Download YOLO model
    if not download_yolo_model():
        print("❌ Failed to download YOLO model")
        sys.exit(1)
    
    # Create .env file
    create_env_file()
    
    # Test AI modules
    if not test_ai_module():
        print("❌ AI module test failed")
        sys.exit(1)
    
    print("\n🎉 TraffEye Backend setup completed successfully!")
    print("\n📝 Next steps:")
    print("1. Edit .env file with your configuration")
    print("2. Make sure MongoDB is running")
    print("3. Run: python main.py")
    print("4. Visit: http://localhost:8000/docs for API documentation")

if __name__ == "__main__":
    main()
