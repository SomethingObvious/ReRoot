import { DEMO_RECEIPT, type Receipt } from "./mockData";

const API_BASE = "http://127.0.0.1:8000";

export async function scanReceipt(file: File): Promise<Receipt> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/scan`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Scan failed");
    return await response.json();
  } catch {
    // Fallback to demo data when backend is unreachable
    await new Promise((r) => setTimeout(r, 3000)); // Simulate processing
    return DEMO_RECEIPT;
  }
}
