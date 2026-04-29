import requests
import pandas as pd
from io import StringIO
from datetime import date, timedelta
import os

def next_weekly_expiry(day=1):
    """
    NIFTY weekly: Tuesday (1)
    SENSEX weekly: Thursday (3)
    """
    today = date.today()
    while today.weekday() != day:
        today += timedelta(days=1)
    return today.strftime("%d%b%y").upper()

def download_csv(url):
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.text

def filter_nifty(csv_text, script, expiry):
    # Load into pandas
    df = pd.read_csv(StringIO(csv_text))
    
    # If your CSV has a trading symbol column with NIFTY in it, use that:
    # (adjust column name if different: maybe 'trdSym', 'symbol', 'TradingSymbol', etc.)
    # Here we do a case-insensitive contains match for 'NIFTY'
    filtered = df[
        df["pSymbolName"].astype(str).str.strip().eq(script) &
        df["pScripRefKey"].astype(str).str.contains(expiry, case=False, na=False)
    ]
    
    return filtered

def readCSV(URL, script, day):
    expiry = next_weekly_expiry(int(day))

    file_name = f"{expiry}-{script}_filtered.csv"

    # 📥 Download script if file not exist
    if os.path.exists(file_name):
        return
    
    print("Downloading CSV...")
    csv_text = download_csv(URL)

    print(f"Filtering {script} rows...")
    nifty_df = filter_nifty(csv_text, script, expiry)
    
    if len(nifty_df) == 0:
       expiry = next_weekly_expiry(int(day) - 1)
       nifty_df = filter_nifty(csv_text, script, expiry) 

    print(f"Total {script} rows: {len(nifty_df)}")
    print(nifty_df.head())
    
    # Optional: save to file
    nifty_df.to_csv(f"{expiry}-{script}_filtered.csv", index=False)
    print(f"Filtered data saved to {expiry}-{script}_filtered.csv")