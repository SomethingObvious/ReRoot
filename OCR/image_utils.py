import cv2
import numpy as np
import os

def preprocess_image_for_ocr(image_path: str) -> str:
    """
    Loads an image, applies grayscale, noise reduction, and adaptive thresholding
    to make text pop out against the background.
    
    Returns: Path to the processed image (saved temporarily).
    """
    # 1. Load Image
    image = cv2.imread(image_path)
    if image is None:
        # Fallback: If image load fails, just return original path so OCR can try
        return image_path

    # 2. Resize if too massive (Optimization for Speed & Memory)
    height, width = image.shape[:2]
    if width > 1500:
        scaling_factor = 1500 / width
        image = cv2.resize(image, None, fx=scaling_factor, fy=scaling_factor, interpolation=cv2.INTER_AREA)

    # 3. Convert to Grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # 4. Standard Denoising
    # Remove Gaussian noise
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)

    # 5. Adaptive Thresholding (Binarization)
    # This turns the image into pure black and white, excellent for OCR
    binary = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    # 6. Save Processed Image Intermediate
    # We save this so OCR can read the high-contrast version
    processed_path = image_path.replace(".", "_processed.")
    cv2.imwrite(processed_path, binary)
    
    return processed_path