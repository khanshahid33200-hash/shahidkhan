import urllib.request
import json
import subprocess

PROJECT_ID = "rb-production-afb2d"

# Fetch Google Cloud OAuth access token
try:
    ACCESS_TOKEN = subprocess.check_output("gcloud auth print-access-token", shell=True).decode('utf-8').strip()
    print("✓ Successfully fetched Google Cloud OAuth Access Token")
except Exception as e:
    print("Warning: Failed to fetch gcloud token:", e)
    ACCESS_TOKEN = None

BASE_URL = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents"

# Demo document IDs to delete from contacts, projects, services, tools, stats
DEMO_CONTACT_IDS = ["lead_sample_1", "demo_1", "demo_2", "sample_lead"]

def delete_document(collection_name, doc_id):
    headers = {}
    if ACCESS_TOKEN:
        headers["Authorization"] = f"Bearer {ACCESS_TOKEN}"

    url = f"{BASE_URL}/{collection_name}/{doc_id}"
    req = urllib.request.Request(url, headers=headers, method="DELETE")
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"  [DELETED] {collection_name}/{doc_id}: HTTP {resp.status}")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"  [NOT FOUND] {collection_name}/{doc_id}: Already clean")
        else:
            print(f"  [NOTICE] {collection_name}/{doc_id}: HTTP {e.code}")

if __name__ == "__main__":
    print("\n--- Cleaning Demo Data from Firebase Firestore ---")
    for cid in DEMO_CONTACT_IDS:
        delete_document("contacts", cid)

    print("\n>>> FIRESTORE DEMO DATA PURGE COMPLETED <<<")
