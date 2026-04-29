import pyotp
# import os

def generate_totp(SECRET) -> str:
    totp = pyotp.TOTP(SECRET)
    try:
        currentTotp = totp.now()
        return currentTotp
    except Exception as e:
        return SECRET