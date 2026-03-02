from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import json
from datetime import datetime
from process_receipt import process_receipt_with_easyocr

app = FastAPI(title="ReRoot API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "database.json"

def load_db():
    # If file doesn't exist, return default
    if not os.path.exists(DB_FILE):
        return {"receipts": [], "products": {}}
    
    try:
        with open(DB_FILE, "r") as f:
            # Handle empty file case by reading content first
            content = f.read().strip()
            if not content:
                return {"receipts": [], "products": {}}
            return json.loads(content)
    except json.JSONDecodeError:
        # If file is corrupt, reset it (or you could backup and error out)
        print("Warning: database.json was corrupt. Resetting.")
        return {"receipts": [], "products": {}}

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

UPLOAD_DIR = "uploaded_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "ReRoot Backend is Live 🚀"}

@app.post("/scan")
async def scan_receipt(file: UploadFile = File(...)):
    # 1. Save Image Locally
    file_location = f"{UPLOAD_DIR}/{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Run OCR Processing
    try:
        extracted_data = process_receipt_with_easyocr(file_location)
    except Exception as e:
        # cleanup image on failure if you want
        raise HTTPException(status_code=500, detail=f"OCR Processing Failed: {str(e)}")

    # 3. Add Metadata & Save to JSON DB
    db = load_db()
    
    receipt_record = {
        "id": len(db["receipts"]) + 1,
        "filename": file.filename,
        "upload_date": datetime.now().isoformat(),
        "store": extracted_data.get("store"),
        "total": extracted_data.get("total"),
        "items": extracted_data.get("items"),
        "raw_text": extracted_data.get("raw_text_lines")
    }
    
    db["receipts"].append(receipt_record)
    
    # Simple Product Aggregation
    for item in extracted_data.get("items", []):
        prod_name = item["name"]
        prod_hash = prod_name.lower().replace(" ", "")
        
        if prod_hash not in db["products"]:
            db["products"][prod_hash] = {
                "name": prod_name,
                "seen_count": 1,
                "category": "Uncategorized"
            }
        else:
            db["products"][prod_hash]["seen_count"] += 1

    save_db(db)

    return {"status": "success", "data": receipt_record}

@app.get("/history")
def get_history():
    db = load_db()
    return db["receipts"]