import os
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    average_precision_score,
    roc_curve,
    precision_recall_curve
)
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier


# ============================================================
# CONFIGURATION
# ============================================================

DATA_PATH = "data/creditcard.csv"
MODEL_DIR = "model"

os.makedirs(MODEL_DIR, exist_ok=True)


# ============================================================
# LOAD DATASET
# ============================================================

print("\nLoading dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Dataset shape: {df.shape}")

print("\nClass distribution:")
print(df["Class"].value_counts())

print("\nFraud percentage:")
print(f"{df['Class'].mean() * 100:.4f}%")


# ============================================================
# FEATURES / TARGET
# ============================================================

X = df.drop("Class", axis=1)
y = df["Class"]


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ============================================================
# FEATURE SCALING
# ============================================================

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


# ============================================================
# HANDLE CLASS IMBALANCE
# ============================================================

fraud_count = (y_train == 1).sum()
legitimate_count = (y_train == 0).sum()

scale_pos_weight = legitimate_count / fraud_count

print("\nClass weight:")
print(f"scale_pos_weight = {scale_pos_weight:.2f}")


# ============================================================
# MODELS
# ============================================================

models = {

    "Logistic Regression": LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        random_state=42
    ),

    "Random Forest": RandomForestClassifier(
        n_estimators=200,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    ),

    "XGBoost": XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        scale_pos_weight=scale_pos_weight,
        eval_metric="logloss",
        random_state=42,
        n_jobs=-1
    )
}


# ============================================================
# TRAIN + EVALUATE
# ============================================================

results = {}

for name, model in models.items():

    print("\n" + "=" * 60)
    print(f"Training: {name}")
    print("=" * 60)

    # XGBoost / tree models don't require scaling,
    # but using the scaled data here keeps the comparison
    # pipeline consistent.
    model.fit(X_train_scaled, y_train)

    predictions = model.predict(X_test_scaled)
    probabilities = model.predict_proba(X_test_scaled)[:, 1]

    roc_auc = roc_auc_score(y_test, probabilities)
    pr_auc = average_precision_score(y_test, probabilities)

    results[name] = {
        "model": model,
        "roc_auc": roc_auc,
        "pr_auc": pr_auc
    }

    print("\nClassification Report:")
    print(classification_report(y_test, predictions))

    print("Confusion Matrix:")
    print(confusion_matrix(y_test, predictions))

    print(f"ROC-AUC: {roc_auc:.4f}")
    print(f"PR-AUC:  {pr_auc:.4f}")


# ============================================================
# SELECT MODEL
# ============================================================

best_model_name = max(
    results,
    key=lambda name: results[name]["pr_auc"]
)

best_model = results[best_model_name]["model"]

print("\n" + "=" * 60)
print("BEST MODEL")
print("=" * 60)

print(f"Model: {best_model_name}")
print(f"PR-AUC: {results[best_model_name]['pr_auc']:.4f}")
print(f"ROC-AUC: {results[best_model_name]['roc_auc']:.4f}")


# ============================================================
# SAVE MODEL
# ============================================================

model_path = os.path.join(MODEL_DIR, "fraud_model.pkl")
scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")

joblib.dump(best_model, model_path)
joblib.dump(scaler, scaler_path)

print("\nModel saved:")
print(model_path)

print("\nScaler saved:")
print(scaler_path)

print("\nTraining completed successfully! 🚀")

# ============================================================
# SAVE MODEL ANALYTICS
# ============================================================

import json


# Predictions from the selected model
best_predictions = best_model.predict(X_test_scaled)

best_probabilities = best_model.predict_proba(
    X_test_scaled
)[:, 1]


# Classification metrics
report = classification_report(
    y_test,
    best_predictions,
    output_dict=True
)


# Confusion matrix
cm = confusion_matrix(
    y_test,
    best_predictions
)


# ROC curve
fpr, tpr, roc_thresholds = roc_curve(
    y_test,
    best_probabilities
)


# Precision-recall curve
precision_curve, recall_curve, pr_thresholds = precision_recall_curve(
    y_test,
    best_probabilities
)


# Model comparison
model_comparison = {}

for name, result in results.items():

    model_comparison[name] = {
        "roc_auc": round(
            float(result["roc_auc"]),
            6
        ),

        "pr_auc": round(
            float(result["pr_auc"]),
            6
        )
    }


analytics = {

    "model": best_model_name,

    "dataset": {
        "total_transactions": int(len(df)),
        "legitimate_transactions": int(
            (df["Class"] == 0).sum()
        ),
        "fraud_transactions": int(
            (df["Class"] == 1).sum()
        ),
        "fraud_percentage": round(
            float(df["Class"].mean() * 100),
            4
        )
    },

    "metrics": {

        "accuracy": round(
            float(report["accuracy"]),
            6
        ),

        "precision": round(
            float(report["1"]["precision"]),
            6
        ),

        "recall": round(
            float(report["1"]["recall"]),
            6
        ),

        "f1_score": round(
            float(report["1"]["f1-score"]),
            6
        ),

        "roc_auc": round(
            float(
                roc_auc_score(
                    y_test,
                    best_probabilities
                )
            ),
            6
        ),

        "pr_auc": round(
            float(
                average_precision_score(
                    y_test,
                    best_probabilities
                )
            ),
            6
        )
    },

    "confusion_matrix": {

        "true_negative": int(cm[0][0]),

        "false_positive": int(cm[0][1]),

        "false_negative": int(cm[1][0]),

        "true_positive": int(cm[1][1])
    },

    "model_comparison": model_comparison,

    "roc_curve": [
        {
            "fpr": round(float(x), 6),
            "tpr": round(float(y), 6)
        }

        for x, y in zip(fpr, tpr)
    ],

    "precision_recall_curve": [
        {
            "precision": round(float(p), 6),
            "recall": round(float(r), 6)
        }

        for p, r in zip(
            precision_curve,
            recall_curve
        )
    ]
}


analytics_path = os.path.join(
    MODEL_DIR,
    "analytics.json"
)


with open(
    analytics_path,
    "w"
) as file:

    json.dump(
        analytics,
        file,
        indent=2
    )


print("\nAnalytics saved:")
print(analytics_path)