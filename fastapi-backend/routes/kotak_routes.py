from fastapi import APIRouter, Request
import pandas as pd
import os
from libs.genFunction import generate_totp
from neo_api_client import NeoAPI
from database.mongodb import MongoDB
from services.csv_filter import readCSV

router = APIRouter(prefix="/kotak", tags=["Kotak"])

client = None

def downloadScript(client):
    if not client:
        return {"error": "Client not logged in"}
    
    scriptMaster = client.scrip_master()
    scriptPath = scriptMaster.get("filesPaths")
    nseDataFile = scriptPath[2]    
    readCSV(nseDataFile, "NIFTY", 1)

    bseDataFile = scriptPath[3]
    readCSV(bseDataFile, "SENSEX", 3)
    return {"script": "Script loaded successfully."}


async def loginKotak(request: Request) -> NeoAPI:

    global client

    config = await MongoDB.db.config.find_one({}, {
        "consumerkey": 1,
        "mobile": 1,
        "ucc": 1,
        "mpin": 1,
        "totp": 1,
        
    })

    if not config:
        return "Configuration not found"

    CONSUMER_SECRET = config["consumerkey"]
    print(CONSUMER_SECRET)
    
    MOBILE = config["mobile"]
    print(MOBILE)
  
    UCC = config["ucc"]
    print(UCC)
   
    MPIN = config["mpin"]
    print(MPIN)
    
    SECRET = config["totp"]
    print(SECRET)

    client = NeoAPI(
        environment="prod",
        access_token=None,
        neo_fin_key=None,
        consumer_key=CONSUMER_SECRET
    )

    try:
        totp = generate_totp(SECRET)

        client.totp_login(
            mobile_number=MOBILE,
            ucc=UCC,
            totp=totp
        )

        client.totp_validate(mpin=MPIN)

        # Download csv and read it.
        # downloadScript(client=client)

        return client

    except Exception as e:
        print(e)
        return str(e)


@router.get("/")
async def home(request: Request):

    result = await loginKotak(request)

    if isinstance(result, str):
        return {"error": result}

    request.app.state.kotak_client = result

    return {"message": "Kotak Login successfully"}


@router.get("/trades")
async def todayTrades(request: Request):

    client = request.app.state.kotak_client

    if not client:
        return {"error": "Kotak not logged in"}

    try:
        trade_report = client.trade_report()
    except Exception as e:
        return {"error": str(e)}
    
    print(trade_report)

    trades = []

    if isinstance(trade_report, dict):
        trades = (
            trade_report.get("data")
            or trade_report.get("Trades")
            or trade_report.get("trades")
            or []
        )

    return trades

def neoBalance(client):    
    balance = client.limits(
        segment="ALL",
        exchange="ALL",
        product="ALL"
    )

    response = {
        "cash": balance.get("CollateralValue", 0),
        "pledge_cash": balance.get("Collateral", 0),
        "used": balance.get("MarginUsed", 0),
        "total": balance.get("Net", 0)
    }

    return response

@router.get("/balance")
def get_balance():
    global client

    # ✅ check login
    if client is None:
        return {"status": "error", "message": "Not logged in"}

    try:
        data = neoBalance(client)
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}