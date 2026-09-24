from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel,Field
import pandas as pd
import numpy as np
import joblib
import os
from io import BytesIO

import json
class TransactionInput(BaseModel):
    Time: float = Field(..., description="Transaction time")
    
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    
    Amount: float = Field(..., ge=0, description="Transaction amount")
# ============================================================
# APP CONFIGURATION
# ============================================================

app = FastAPI(
    title="Credit Card Fraud Detection API",
    description="Machine Learning API for detecting fraudulent transactions",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================
# CORS
# ================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "https://frontend-ivory-two-40.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# LOAD MODEL
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "fraud_model.pkl"
)

SCALER_PATH = os.path.join(
    BASE_DIR,
    "model",
    "scaler.pkl"
)

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


# ============================================================
# REQUEST MODEL
# ============================================================

class Transaction(BaseModel):

    Time: float

    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float

    Amount: float


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def home():

    return {
        "status": "online",
        "service": "Credit Card Fraud Detection API",
        "model": "XGBoost",
        "version": "1.0.0"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None
    }
# ============================================================
# DEMO TRANSACTION
# ============================================================

@app.get("/demo-transaction")
def demo_transaction():
    try:
        DEMO_DATA_PATH = os.path.join(
            BASE_DIR,
            "data",
            "demo_transactions.csv"
        )

        demo_df = pd.read_csv(DEMO_DATA_PATH)

        # Randomly choose either legitimate or fraudulent
        demo_class = np.random.choice([0, 1])

        # Select a random transaction from that class
        class_data = demo_df[demo_df["Class"] == demo_class]

        sample = class_data.sample(n=1).iloc[0]

        transaction = {
            "Time": float(sample["Time"]),
            "V1": float(sample["V1"]),
            "V2": float(sample["V2"]),
            "V3": float(sample["V3"]),
            "V4": float(sample["V4"]),
            "V5": float(sample["V5"]),
            "V6": float(sample["V6"]),
            "V7": float(sample["V7"]),
            "V8": float(sample["V8"]),
            "V9": float(sample["V9"]),
            "V10": float(sample["V10"]),
            "V11": float(sample["V11"]),
            "V12": float(sample["V12"]),
            "V13": float(sample["V13"]),
            "V14": float(sample["V14"]),
            "V15": float(sample["V15"]),
            "V16": float(sample["V16"]),
            "V17": float(sample["V17"]),
            "V18": float(sample["V18"]),
            "V19": float(sample["V19"]),
            "V20": float(sample["V20"]),
            "V21": float(sample["V21"]),
            "V22": float(sample["V22"]),
            "V23": float(sample["V23"]),
            "V24": float(sample["V24"]),
            "V25": float(sample["V25"]),
            "V26": float(sample["V26"]),
            "V27": float(sample["V27"]),
            "V28": float(sample["V28"]),

            "Amount": float(sample["Amount"]),

            "actual_class": int(sample["Class"])
        }

        return transaction

    except Exception as e:
        return {
            "error": str(e)
        }
# ============================================================
# MODEL ANALYTICS
# ============================================================

@app.get("/analytics")
def analytics():

    analytics_path = os.path.join(
        BASE_DIR,
        "model",
        "analytics.json"
    )

    if not os.path.exists(analytics_path):

        return {
            "error": "Analytics file not found. Run train.py first."
        }

    with open(
        analytics_path,
        "r"
    ) as file:

        data = json.load(file)

    return data
@app.post("/analyze-csv")
async def analyze_csv(file: UploadFile = File(...)):
    try:
        # Only allow CSV files
        if not file.filename.lower().endswith(".csv"):
            raise HTTPException(
                status_code=400,
                detail="Please upload a CSV file."
            )

        # Read uploaded CSV into memory
        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="The uploaded CSV file is empty."
            )

        df = pd.read_csv(BytesIO(contents))

        # Normalize column names for detection
        columns = {str(col).strip().lower() for col in df.columns}

        # ---------------------------------------------------------
        # DATASET 1: User0 Credit Card Transactions
        # ---------------------------------------------------------
        if "is fraud?" in columns:

            # Find the original column name
            fraud_column = next(
                col for col in df.columns
                if str(col).strip().lower() == "is fraud?"
            )

            # Convert labels to fraud/legitimate
            fraud_mask = (
                df[fraud_column]
                .astype(str)
                .str.strip()
                .str.lower()
                .eq("yes")
            )

            dataset_name = "User0 Credit Card Transactions"

            total_transactions = len(df)
            fraud_count = int(fraud_mask.sum())
            legitimate_count = int(total_transactions - fraud_count)

            fraud_rate = (
                (fraud_count / total_transactions) * 100
                if total_transactions > 0
                else 0
            )

            # Calculate transaction amount statistics if available
            amount_column = next(
                (
                    col for col in df.columns
                    if str(col).strip().lower() == "amount"
                ),
                None,
            )

            total_amount = None
            average_amount = None

            if amount_column:
                amounts = pd.to_numeric(
                    df[amount_column],
                    errors="coerce"
                ).fillna(0)

                total_amount = float(amounts.sum())
                average_amount = float(amounts.mean())

            return {
                "success": True,
                "dataset": dataset_name,
                "filename": file.filename,
                "total_transactions": total_transactions,
                "fraud_count": fraud_count,
                "legitimate_count": legitimate_count,
                "fraud_rate": round(fraud_rate, 4),
                "total_amount": total_amount,
                "average_amount": average_amount,
                "columns": list(df.columns),
            }

        # ---------------------------------------------------------
        # DATASET 2: CC_FRAUD
        # ---------------------------------------------------------
        elif "trn_type" in columns:

            # Find the original column name
            fraud_column = next(
                col for col in df.columns
                if str(col).strip().lower() == "trn_type"
            )

            # FRAUD = fraud
            fraud_mask = (
                df[fraud_column]
                .astype(str)
                .str.strip()
                .str.upper()
                .eq("FRAUD")
            )

            dataset_name = "CC Fraud Dataset"

            total_transactions = len(df)
            fraud_count = int(fraud_mask.sum())
            legitimate_count = int(total_transactions - fraud_count)

            fraud_rate = (
                (fraud_count / total_transactions) * 100
                if total_transactions > 0
                else 0
            )

            # Transaction amount
            amount_column = next(
                (
                    col for col in df.columns
                    if str(col).strip().upper() == "TRN_AMT"
                ),
                None,
            )

            total_amount = None
            average_amount = None

            if amount_column:
                amounts = pd.to_numeric(
                    df[amount_column],
                    errors="coerce"
                ).fillna(0)

                total_amount = float(amounts.sum())
                average_amount = float(amounts.mean())

            return {
                "success": True,
                "dataset": dataset_name,
                "filename": file.filename,
                "total_transactions": total_transactions,
                "fraud_count": fraud_count,
                "legitimate_count": legitimate_count,
                "fraud_rate": round(fraud_rate, 4),
                "total_amount": total_amount,
                "average_amount": average_amount,
                "columns": list(df.columns),
            }

        # ---------------------------------------------------------
        # UNSUPPORTED DATASET
        # ---------------------------------------------------------
        else:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Unsupported dataset format. "
                    "Supported datasets are "
                    "'User0 Credit Card Transactions' "
                    "and 'CC Fraud Dataset'."
                )
            )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"CSV analysis failed: {str(e)}"
        )
# ============================================================
# PREDICTION
# ============================================================
@app.post("/predict")
def predict(transaction: TransactionInput):

    # Convert request to dictionary
    transaction_data = transaction.model_dump()

    # Create dataframe
    input_data = pd.DataFrame(
        [transaction_data]
    )

    # Make sure columns are in correct dataset order
    input_data = input_data[
        [
            "Time",
            "V1",
            "V2",
            "V3",
            "V4",
            "V5",
            "V6",
            "V7",
            "V8",
            "V9",
            "V10",
            "V11",
            "V12",
            "V13",
            "V14",
            "V15",
            "V16",
            "V17",
            "V18",
            "V19",
            "V20",
            "V21",
            "V22",
            "V23",
            "V24",
            "V25",
            "V26",
            "V27",
            "V28",
            "Amount"
        ]
    ]

    # Scale input
    scaled_data = scaler.transform(input_data)

    # Prediction
    prediction = model.predict(scaled_data)[0]

    # Probability
    probability = model.predict_proba(
        scaled_data
    )[0][1]

    # Risk level
    if probability >= 0.75:
        risk = "HIGH"

    elif probability >= 0.40:
        risk = "MEDIUM"

    else:
        risk = "LOW"

    return {

        "prediction": int(prediction),

        "fraud": bool(prediction == 1),

        "fraud_probability": round(
            float(probability) * 100,
            2
        ),

        "risk": risk

    }