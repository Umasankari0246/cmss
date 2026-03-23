import requests
import json

response = requests.get("http://127.0.0.1:5000/api/analytics/dashboard")
data = response.json()

print("Status:", response.status_code)
print("Success:", data.get("success"))

if data.get("success"):
    analytics_data = data.get("data", {})
    print("Keys in data:", list(analytics_data.keys()))
    
    if "financeData" in analytics_data:
        finance_data = analytics_data["financeData"]
        print("Finance data keys:", list(finance_data.keys()))
        print("Total collected:", finance_data.get("totalCollected"))
        print("Monthly revenue entries:", len(finance_data.get("monthlyRevenue", [])))
        print("Payment status:", finance_data.get("paymentStatus"))
    else:
        print("No financeData found in response")
else:
    print("Error:", data.get("error", "Unknown error"))
