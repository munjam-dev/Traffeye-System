import cv2
import numpy as np
from ultralytics import YOLO
import torch
import os
from typing import List, Dict, Any
import asyncio
from datetime import datetime
import uuid

class TrafficViolationDetector:
    def __init__(self):
        self.model = None
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.class_names = ['helmet', 'no_helmet', 'person', 'motorbike']
        self.colors = {
            'helmet': (0, 255, 0),      # Green
            'no_helmet': (0, 0, 255),  # Red
            'person': (255, 0, 0),      # Blue
            'motorbike': (255, 255, 0)  # Yellow
        }
        
    async def load_models(self):
        """Load YOLOv8 model"""
        try:
            # Load YOLOv8n model (nano version for speed)
            model_path = "ai_module/models/yolov8n.pt"
            if not os.path.exists(model_path):
                # Download model if not exists
                self.model = YOLO('yolov8n.pt')
                self.model.save(model_path)
            else:
                self.model = YOLO(model_path)
            
            self.model.to(self.device)
            print(f"YOLOv8 model loaded on {self.device}")
            
        except Exception as e:
            print(f"Error loading model: {e}")
            raise

    async def detect_violations(self, video_path: str) -> List[Dict[str, Any]]:
        """Process video and detect violations"""
        violations = []
        
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise Exception(f"Cannot open video: {video_path}")
            
            frame_count = 0
            fps = cap.get(cv2.CAP_PROP_FPS)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            # Process every 3rd frame for performance
            frame_skip = 3
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                if frame_count % frame_skip == 0:
                    # Run detection
                    results = self.model(frame, verbose=False)
                    
                    # Process detections
                    frame_violations = self._process_frame_detections(
                        frame, results, frame_count, fps
                    )
                    
                    violations.extend(frame_violations)
                
                frame_count += 1
                
                # Stop after processing reasonable number of frames
                if frame_count > min(total_frames, 1000):
                    break
            
            cap.release()
            
            # Save violation images
            violations = await self._save_violation_images(violations, video_path)
            
            return violations
            
        except Exception as e:
            print(f"Error processing video: {e}")
            raise

    def _process_frame_detections(self, frame, results, frame_count: int, fps: float) -> List[Dict[str, Any]]:
        """Process detections for a single frame"""
        violations = []
        
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                detections = []
                motorbike_groups = []
                
                for box in boxes:
                    # Get bounding box coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    conf = box.conf[0].cpu().numpy()
                    cls = int(box.cls[0].cpu().numpy())
                    
                    if cls < len(self.class_names):
                        class_name = self.class_names[cls]
                        
                        detection = {
                            'bbox': [int(x1), int(y1), int(x2), int(y2)],
                            'confidence': float(conf),
                            'class': class_name,
                            'class_id': cls
                        }
                        detections.append(detection)
                        
                        if class_name == 'motorbike':
                            motorbike_groups.append(detection)
                
                # Analyze violations
                frame_violations = self._analyze_violations(
                    detections, motorbike_groups, frame_count, fps
                )
                
                for violation in frame_violations:
                    violation['frame'] = frame
                    violations.append(violation)
        
        return violations

    def _analyze_violations(self, detections, motorbike_groups, frame_count: int, fps: float) -> List[Dict[str, Any]]:
        """Analyze detections for traffic violations"""
        violations = []
        
        for motorbike in motorbike_groups:
            bike_bbox = motorbike['bbox']
            
            # Find riders associated with this motorbike
            riders = []
            helmets = []
            no_helmets = []
            
            for detection in detections:
                if detection['class'] in ['person', 'helmet', 'no_helmet']:
                    # Check if person/helmet is near motorbike
                    if self._is_near_motorbike(detection['bbox'], bike_bbox):
                        if detection['class'] == 'person':
                            riders.append(detection)
                        elif detection['class'] == 'helmet':
                            helmets.append(detection)
                        elif detection['class'] == 'no_helmet':
                            no_helmets.append(detection)
            
            # Check for no helmet violations
            for no_helmet in no_helmets:
                violations.append({
                    'type': 'no_helmet',
                    'confidence': no_helmet['confidence'],
                    'bbox': no_helmet['bbox'],
                    'frame_count': frame_count,
                    'timestamp': frame_count / fps
                })
            
            # Check for triple riding violations
            total_riders = len(riders) + len(helmets) + len(no_helmets)
            if total_riders > 2:
                violations.append({
                    'type': 'triple_riding',
                    'confidence': 0.8,  # Confidence based on detection
                    'bbox': bike_bbox,
                    'frame_count': frame_count,
                    'timestamp': frame_count / fps,
                    'riders_count': total_riders
                })
        
        return violations

    def _is_near_motorbike(self, bbox, motorbike_bbox, threshold=50) -> bool:
        """Check if a detection is near a motorbike"""
        # Calculate center points
        bbox_center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2]
        motorbike_center = [(motorbike_bbox[0] + motorbike_bbox[2]) / 2, 
                          (motorbike_bbox[1] + motorbike_bbox[3]) / 2]
        
        # Calculate distance
        distance = np.sqrt((bbox_center[0] - motorbike_center[0])**2 + 
                          (bbox_center[1] - motorbike_center[1])**2)
        
        return distance < threshold

    async def _save_violation_images(self, violations: List[Dict[str, Any]], video_path: str) -> List[Dict[str, Any]]:
        """Save violation frames as images"""
        processed_violations = []
        
        # Create violations directory
        violations_dir = "uploads/violations"
        os.makedirs(violations_dir, exist_ok=True)
        
        for i, violation in enumerate(violations):
            frame = violation['frame']
            bbox = violation['bbox']
            
            # Draw bounding box on frame
            annotated_frame = frame.copy()
            x1, y1, x2, y2 = bbox
            
            # Draw rectangle
            color = self.colors.get(violation['type'], (255, 255, 255))
            cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 3)
            
            # Add label
            label = f"{violation['type'].replace('_', ' ').title()}: {violation['confidence']:.2f}"
            label_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)[0]
            cv2.rectangle(annotated_frame, (x1, y1 - label_size[1] - 10), 
                         (x1 + label_size[0], y1), color, -1)
            cv2.putText(annotated_frame, label, (x1, y1 - 5), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            # Save image
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            image_filename = f"violation_{violation['type']}_{timestamp}_{i}.jpg"
            image_path = os.path.join(violations_dir, image_filename)
            
            cv2.imwrite(image_path, annotated_frame)
            
            # Update violation data
            violation_data = {
                'type': violation['type'],
                'confidence': violation['confidence'],
                'image_path': image_path,
                'frame_count': violation['frame_count'],
                'timestamp': violation['timestamp']
            }
            
            if violation['type'] == 'triple_riding':
                violation_data['riders_count'] = violation['riders_count']
            
            processed_violations.append(violation_data)
        
        return processed_violations

    async def detect_signal_violation(self, frame, stop_line_y: int, traffic_light_color: str) -> bool:
        """Detect signal violation (vehicle crossing stop line)"""
        # This is a simplified version
        # In production, you'd need more sophisticated stop line detection
        
        # Detect vehicles in the frame
        results = self.model(frame, verbose=False)
        
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    cls = int(box.cls[0].cpu().numpy())
                    # Check for vehicles (car, truck, bus, motorcycle)
                    if cls in [2, 3, 5, 7]:  # COCO classes for vehicles
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        
                        # Check if vehicle crossed stop line
                        if y1 > stop_line_y and traffic_light_color == 'red':
                            return True
        
        return False
