# from fastapi import APIRouter, Request
# import os
# import re
# import requests
# from services.trade_engine import find_token, placeOrder

# router = APIRouter(prefix="/telegram", tags=["Telegram"])

# BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# NGROK_URL = "https://YOUR-NGROK-URL.ngrok-free.app"

# chat_id = None

# def set_webhook():
#     url = f"https://api.telegram.org/bot8553406095:AAGa8N04Lyxtw0X3VsiYfWUl4jAXr-uRcFQ/setWebhook?url=https://brainy-pediatric-ruthann.ngrok-free.dev/telegram/webhook"
#     response = requests.get(url)
#     print("🔗 Webhook Set Response:", response.json())


# @router.post("/webhook")
# async def telegram_webhook(req: Request):
#     global chat_id

#     data = await req.json()

#     if "message" not in data:
#         return {"status": "ignored"}

#     # ✅ SAVE CHAT ID
#     chat_id = data["message"]["chat"]["id"]
#     print("✅ Connected chat_id:", chat_id)

#     text = data["message"].get("text", "").lower().strip()
#     print("📩 Raw Telegram Message:", text)

#     # 🔹 CLEAN TEXT
#     clean = re.sub(r"(lot|buying|selling|stoploss)", "", text)
#     clean = re.sub(r"\s+", " ", clean).strip()

#     parts = clean.split(" ")

#     if len(parts) < 6:
#         print("❌ Order Rejected")
#         return {"status": "order_rejected"}

#     symbol = parts[0].upper()
#     strike = parts[1]

#     # 🔴 CE / PE VALIDATION
#     if not (strike.endswith("ce") or strike.endswith("pe")):
#         print("❌ Order Rejected")
#         return {"status": "order_rejected"}

#     try:
#         quantity = int(parts[2])
#         buy_price = float(parts[3])
#         sell_price = float(parts[4])
#         stoploss = float(parts[5])
#     except Exception:
#         print("❌ Order Rejected")
#         return {"status": "order_rejected"}

#     parsed_data = {
#         "symbol": symbol,
#         "strike": strike,
#         "quantity": quantity,
#         "buy_price": buy_price,
#         "sell_price": sell_price,
#         "stoploss": stoploss,
#     }

#     print("✅ Parsed Order:", parsed_data)

#     await placeOrder(req, parsed_data)

#     return {
#         "status": "order_accepted",
#         "data": parsed_data,
#     }


# # ✅ TELEGRAM CONNECTION STATUS
# @router.get("/status")
# async def telegram_status():
#     if chat_id:
#         return {"connected": True}
#     return {"connected": False}





from fastapi import APIRouter, Request, WebSocket
import os
import re
import requests

router = APIRouter(prefix="/telegram", tags=["Telegram"])

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

chat_id = None

# ================================
# 🔌 WEBSOCKET (ADDED)
# ================================
clients = []

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    print("🟢 Dashboard Connected")

    try:
        while True:
            await websocket.receive_text()
    except:
        clients.remove(websocket)
        print("🔴 Dashboard Disconnected")


# ================================
# 🔔 NOTIFICATION (ADDED)
# ================================
async def notify_all(message: str):
    for client in clients:
        await client.send_text(message)


# ================================
# 🔗 WEBHOOK (SAME)
# ================================
def set_webhook():
    url = f"https://api.telegram.org/bot8553406095:AAGa8N04Lyxtw0X3VsiYfWUl4jAXr-uRcFQ/setWebhook?url=https://brainy-pediatric-ruthann.ngrok-free.dev/telegram/webhook"
    response = requests.get(url)
    print("🔗 Webhook Set Response:", response.json())


# ================================
# 📩 TELEGRAM WEBHOOK
# ================================
@router.post("/webhook")
async def telegram_webhook(req: Request):
    global chat_id

    data = await req.json()

    if "message" not in data:
        return {"status": "ignored"}

    chat_id = data["message"]["chat"]["id"]
    print("✅ Connected chat_id:", chat_id)

    text = data["message"].get("text", "").lower().strip()
    print("📩 Raw Telegram Message:", text)

    clean = re.sub(r"(lot|buying|selling|stoploss)", "", text)
    clean = re.sub(r"\s+", " ", clean).strip()

    parts = clean.split(" ")

    # ❌ INVALID FORMAT
    if len(parts) < 6:
        msg = "❌ Invalid Signal"
        print(msg)
        await notify_all(msg)
        return {"status": "order_rejected"}

    symbol = parts[0].upper()
    strike = parts[1]

    # ❌ CE/PE CHECK
    if not (strike.endswith("ce") or strike.endswith("pe")):
        msg = "❌ Invalid CE/PE"
        print(msg)
        await notify_all(msg)
        return {"status": "order_rejected"}

    try:
        quantity = int(parts[2])
        buy_price = float(parts[3])
        sell_price = float(parts[4])
        stoploss = float(parts[5])
    except:
        msg = "❌ Invalid Numbers"
        print(msg)
        await notify_all(msg)
        return {"status": "order_rejected"}

    parsed_data = {
        "symbol": symbol,
        "strike": strike.upper(),
        "quantity": quantity,
        "buy_price": buy_price,
        "sell_price": sell_price,
        "stoploss": stoploss,
    }

    print("✅ Parsed Order:", parsed_data)

    # ================================
    # 🚀 DUMMY EXECUTION (IMPORTANT)
    # ================================
    msg = f"🔔 Trade Executed: {symbol} {strike.upper()}"

    print(msg)
    await notify_all(msg)

    return {
        "status": "order_accepted",
        "data": parsed_data,
    }


# ================================
# 📡 STATUS
# ================================
@router.get("/status")
async def telegram_status():
    return {"connected": bool(chat_id)}