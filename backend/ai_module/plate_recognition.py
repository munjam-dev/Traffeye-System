import cv2
import numpy as np
import easyocr
import re
from typing import Optional, List
import asyncio

class NumberPlateRecognizer:
    def __init__(self):
        self.reader = None
        self.plate_patterns = [
            # Indian vehicle number plate patterns
            r'^[A-Z]{2}\s[0-9]{2}\s[A-Z]{2}\s[0-9]{4}$',  # MH 12 AB 1234
            r'^[A-Z]{2}\s[0-9]{2}\s[A-Z]{1,2}\s[0-9]{4}$',  # MH 12 A 1234
            r'^[A-Z]{2}\s[0-9]{2}\s[0-9]{4}$',  # MH 12 1234
            r'^[A-Z]{2}\s[0-9]{1,2}\s[A-Z]{1,3}\s[0-9]{1,4}$',  # Various formats
        ]
        
    async def initialize(self):
        """Initialize EasyOCR reader"""
        if self.reader is None:
            self.reader = easyocr.Reader(['en'])
            print("EasyOCR reader initialized")

    async def extract_plate(self, image_path: str) -> Optional[str]:
        """Extract number plate from image"""
        await self.initialize()
        
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                return None
            
            # Preprocess image for better OCR
            processed_image = self._preprocess_image(image)
            
            # Run OCR
            results = self.reader.readtext(processed_image)
            
            # Extract and validate text
            plate_numbers = []
            for (bbox, text, confidence) in results:
                if confidence > 0.3:  # Lower threshold for challenging images
                    cleaned_text = self._clean_plate_text(text)
                    if self._is_valid_plate_format(cleaned_text):
                        plate_numbers.append((cleaned_text, confidence))
            
            # Return the best match
            if plate_numbers:
                plate_numbers.sort(key=lambda x: x[1], reverse=True)
                return plate_numbers[0][0]
            
            return None
            
        except Exception as e:
            print(f"Error extracting plate: {e}")
            return None

    def _preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Preprocess image for better OCR accuracy"""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply bilateral filter to reduce noise while keeping edges sharp
        filtered = cv2.bilateralFilter(gray, 11, 17, 17)
        
        # Edge detection
        edged = cv2.Canny(filtered, 30, 200)
        
        # Find contours
        contours, _ = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        # Sort contours by area and keep the largest ones
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:10]
        
        # Find potential plate contours
        plate_contour = None
        for contour in contours:
            approx = cv2.approxPolyDP(contour, 0.018 * cv2.arcLength(contour, True), True)
            
            if len(approx) == 4:  # Rectangle shape
                plate_contour = approx
                break
        
        # If plate contour found, crop and enhance
        if plate_contour is not None:
            x, y, w, h = cv2.boundingRect(plate_contour)
            plate_img = gray[y:y+h, x:x+w]
            
            # Enhance contrast
            plate_img = cv2.equalizeHist(plate_img)
            
            # Apply threshold
            _, plate_img = cv2.threshold(plate_img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            return plate_img
        
        # If no plate contour found, return enhanced grayscale
        enhanced = cv2.equalizeHist(gray)
        _, enhanced = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        return enhanced

    def _clean_plate_text(self, text: str) -> str:
        """Clean and normalize OCR text"""
        # Remove special characters and extra spaces
        cleaned = re.sub(r'[^A-Z0-9\s]', '', text.upper())
        
        # Remove extra spaces
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        
        # Common OCR corrections
        corrections = {
            'O': '0',  # Letter O to zero
            'I': '1',  # Letter I to one
            'S': '5',  # Letter S to five
            'Z': '2',  # Letter Z to two
            'G': '6',  # Letter G to six
            'B': '8',  # Letter B to eight
        }
        
        for wrong, correct in corrections.items():
            cleaned = cleaned.replace(wrong, correct)
        
        return cleaned

    def _is_valid_plate_format(self, text: str) -> bool:
        """Check if text matches valid Indian number plate format"""
        for pattern in self.plate_patterns:
            if re.match(pattern, text):
                return True
        return False

    async def extract_plate_from_frame(self, frame: np.ndarray, vehicle_bbox: List[int]) -> Optional[str]:
        """Extract plate from specific vehicle region in frame"""
        try:
            x1, y1, x2, y2 = vehicle_bbox
            
            # Extract vehicle region
            vehicle_region = frame[y1:y2, x1:x2]
            
            # Try to find plate within vehicle region
            processed_region = self._preprocess_image(vehicle_region)
            
            # Run OCR on vehicle region
            results = self.reader.readtext(processed_region)
            
            plate_numbers = []
            for (bbox, text, confidence) in results:
                if confidence > 0.3:
                    cleaned_text = self._clean_plate_text(text)
                    if self._is_valid_plate_format(cleaned_text):
                        plate_numbers.append((cleaned_text, confidence))
            
            if plate_numbers:
                plate_numbers.sort(key=lambda x: x[1], reverse=True)
                return plate_numbers[0][0]
            
            return None
            
        except Exception as e:
            print(f"Error extracting plate from frame: {e}")
            return None

    async def batch_extract_plates(self, image_paths: List[str]) -> List[Optional[str]]:
        """Extract plates from multiple images concurrently"""
        tasks = [self.extract_plate(path) for path in image_paths]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle exceptions
        processed_results = []
        for result in results:
            if isinstance(result, Exception):
                processed_results.append(None)
            else:
                processed_results.append(result)
        
        return processed_results
