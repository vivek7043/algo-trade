import pandas as pd
from datetime import datetime
from routes.kotak_routes import loginKotak
from services.csv_filter import next_weekly_expiry

def find_token(script, strike):

    day = "1"
    if script == "SENSEX":
        day = "3"

    expiry = next_weekly_expiry(int(day))

    df = pd.read_csv(f"{expiry}-{script}_filtered.csv")

    match = df[df["pTrdSymbol"].str.endswith(strike.upper())]

    if len(match) == 0:
        print("❌ Strike not found in CSV")
        return None

    row = match.iloc[0]

    data = row.to_dict()

    return data


async def placeOrder(request, data):

    client = await loginKotak(request)

    if isinstance(client, str):
        return {"error": client}
    
     # 🔹 FIND TOKEN FROM CSV
    payload = find_token(data.get("symbol"), data.get("strike"))

    token = payload["pSymbol"]

    if token is None:
        print("❌ Token not found - order rejected")
        return {"status": "token_not_found"}
    
    buy_price = data.get("buy_price")
    target_price = data.get("sell_price")
    stoploss = data.get("stoploss")
    quantity_tel = data.get("quantity")
    trading_symbol_t = data.get("symbol") + data.get("strike")

    scrip_token = payload["pSymbol"]
    exchange_segment = payload["pExchSeg"]
    trading_symbol = payload["pTrdSymbol"]

    quantity = int(quantity_tel) * int(payload["lLotSize"])

    current_datetime = datetime.now().strftime("%d-%m-%Y %H:%M")
    entry_payload = {
        "exchange_segment": exchange_segment,
        "product": "NRML",
        "price": str(buy_price),
        "order_type": "L",
        "quantity": str(quantity),
        "validity": "DAY",
        "trading_symbol": trading_symbol,
        "transaction_type": "B",
        "amo": "NO",
        "disclosed_quantity": "0",
        "tag":  f"{trading_symbol_t} ENTRY - {current_datetime}",
        "scrip_token": scrip_token,
    }

    entry_order = client.place_order(**entry_payload)

    if not entry_order or "nOrdNo" not in entry_order:
       print(entry_order)
       return

    order_id = entry_order["nOrdNo"]

    orderDetails = client.trade_report(order_id=order_id)
    if not orderDetails or "data" not in orderDetails:
        print(orderDetails)
        return
    
    orderData = orderDetails.get('data')

    # Subscribe symbol to track stop loss
    # client.subscribe(
    #     instrument_tokens=[{
    #         "instrument_token": scrip_token,
    #         "exchange_segment": exchange_segment,
    #     }],
    #     isIndex=False
    # )

    # 🔹 TARGET ORDER (SELL)
    target_payload = {
        "exchange_segment": exchange_segment,
        "product": "NRML",
        "price": str(target_price),
        "order_type": "L",
        "quantity": str(quantity),
        "validity": "DAY",
        "trading_symbol": trading_symbol,
        "transaction_type": "S",
        "amo": "NO",
        "disclosed_quantity": "0",
        "tag":  f"{trading_symbol_t} TARGET ENTRY - {current_datetime}",
        "scrip_token": scrip_token,
    }

    target_order = client.place_order(**target_payload)

    # 🔹 Save SL in memory for WebSocket tracking
    openTrade = {
        "order": "manual",
        "entry_order_id": order_id,
        "target_order_id": target_order.get("nOrdNo"),
        "exchange_segment": exchange_segment,
        "traded_price": buy_price,
        "target_price": target_price,
        "stop_loss": stoploss,
        "quantity": quantity,
        "script_token": scrip_token,
        "trading_symbol": trading_symbol
    }

    # state.open_trades[scrip_token] = openTrade
    print(openTrade)

    return {
        "status": "success",
        "quantity": str(quantity),
        "entry_price": buy_price,
        "target_price": target_price,
        "stop_loss": stoploss,
        "entry_order": entry_order,
        "target_order": target_order
    }