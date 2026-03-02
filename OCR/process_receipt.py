import easyocr
import re
import json
import os
import torch
from image_utils import preprocess_image_for_ocr # Import our new tool

# --- MVP CATEGORY MAPPING (Simple Heuristic) ---
# In a real app, this would be a database lookup
CATEGORY_KEYWORDS = {
    "Produce": ["CABBAGE", "APPLE", "BANANA", "PLUM", "BERRY", "FRUIT", "VEG", "CUCUMBER", "TOMATO", "POTATO", "ONION", "GARLIC", "LETTUCE", "SUPERFR"],
    "Meat": ["PORK", "BEEF", "CHICKEN", "STEAK", "HAM", "TURKEY", "LAMB", "SAUSAGE", "MEAT"],
    "Dairy": ["MILK", "CHEESE", "YOGURT", "CREAM", "BUTTER", "EGG", "MARGARINE"],
    "Pantry": ["BREAD", "RICE", "PASTA", "FLOUR", "SUGAR", "OIL", "SPICE", "SAUCE", "CAN", "SOUP"],
    "Snacks": ["CHIPS", "COOKIE", "CRACKER", "CANDY", "CHOCOLATE"],
    "Beverage": ["WATER", "JUICE", "SODA", "COKE", "PEPSI", "DRINK", "COFFEE", "TEA"],
    "Household": ["PAPER", "CLEAN", "SOAP", "DETERGENT", "TISSUE"],
}

def assign_category(item_name: str) -> str:
    item_upper = item_name.upper()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(k in item_upper for k in keywords):
            return category
    return "Uncategorized"

def process_receipt_with_easyocr(image_path: str) -> dict:
    print(f"Starts processing '{image_path}'...")

    # --- 1. Preprocess Image (OpenCV) ---
    try:
        # Returns path to a black-and-white, denoised image
        clean_image_path = preprocess_image_for_ocr(image_path)
    except Exception as e:
        print(f"Warning: Preprocessing failed ({e}). Using original.")
        clean_image_path = image_path

    # --- 2. Initialize OCR ---
    try:
        reader = easyocr.Reader(['en'], gpu=True)
    except Exception as e:
        print(f"Error initializing EasyOCR: {e}")
        return {}

    # --- 3. Run OCR on CLEAN image ---
    print("Running text detection and recognition on processed image...")
    try:
        results = reader.readtext(clean_image_path)
    except Exception as e:
        print(f"Error reading image: {e}")
        return {}

    # Cleanup temp file
    if clean_image_path != image_path and os.path.exists(clean_image_path):
        os.remove(clean_image_path)

    if not results:
        print("No text detected.")
        return {}

    # --- 4. Line Reconstruction ---
    # Sort top-to-bottom
    results.sort(key=lambda r: r[0][0][1])

    lines = []
    current_line = []
    y_threshold = 15 # Pixels tolerance for being on the same line

    for idx, box in enumerate(results):
        coords, text, conf = box
        text = text.strip()
        if not text or conf < 0.3: continue # Lower confidence slightly for clean images

        y_center = (coords[0][1] + coords[2][1]) / 2

        if not current_line:
            current_line.append({"text": text, "y": y_center, "x": coords[0][0]})
        else:
            avg_y = sum(w["y"] for w in current_line) / len(current_line)
            if abs(y_center - avg_y) < y_threshold:
                current_line.append({"text": text, "y": y_center, "x": coords[0][0]})
            else:
                current_line.sort(key=lambda w: w["x"])
                lines.append(" ".join(w["text"] for w in current_line))
                current_line = [{"text": text, "y": y_center, "x": coords[0][0]}]

    if current_line:
        current_line.sort(key=lambda w: w["x"])
        lines.append(" ".join(w["text"] for w in current_line))

    # --- 5. Extraction Logic ---
    extracted_data = {
        "store": "Unknown",
        "date": None,
        "items": [],
        "total": None,
    }

    price_pattern = re.compile(r'(-?\$?\d{1,3}(?:,\d{3})*\.\d{2})')
    
    # Store Heuristic
    if lines:
        extracted_data["store"] = lines[0] # Usually first line

    for line in lines:
        clean_text = line.upper()
        
        # Blocklist
        ignore_keywords = ["SAVING", "DISCOUNT", "POINTS", "OFFER", "SUBTOTAL", "TAX", "BALANCE", "CHANGE", "AUTH", "VISA", "MASTERCARD", "DEBIT"]
        if any(keyword in clean_text for keyword in ignore_keywords):
            continue

        prices = price_pattern.findall(clean_text)
        
        if prices:
            final_price = prices[-1]

            if "-" in final_price: continue # Skip negative corrections

            # Name extraction
            name_candidate = clean_text.replace(final_price, "").strip()
            name_candidate = re.sub(r'[.\-_]+$', '', name_candidate).strip()
            
            # --- NEW CLEANING RULES ---
            # Remove weight measurements from start (e.g., "2.395 KG ...")
            name_candidate = re.sub(r'^\d+\.\d+\s*KG\s*', '', name_candidate)
            # Remove quantity indicators (e.g., "2 @", "2 S")
            name_candidate = re.sub(r'^\d+\s*[@S]\s*', '', name_candidate)
            # Remove loose leading numbers
            name_candidate = re.sub(r'^\d+\s+', '', name_candidate)

            if len(name_candidate) > 2:
                if "TOTAL" in name_candidate and "SUB" not in name_candidate:
                    extracted_data["total"] = final_price
                else:
                    # Assign Category
                    category = assign_category(name_candidate)
                    
                    extracted_data["items"].append({
                        "name": name_candidate,
                        "price": final_price,
                        "category": category
                    })

    return extracted_data