# 💳 Credit Card Fraud Detection

An AI-powered credit card fraud detection platform designed to identify potentially fraudulent transactions using machine learning and provide an interactive dashboard for transaction analysis, model evaluation, and dataset insights.

The platform combines a React.js frontend with a FastAPI backend and an XGBoost-based machine learning model to analyze transaction data and estimate fraud risk in real time.

## 🚀 Live Demo

**Credit Card Fraud Detection:**  
Coming soon

## Features

### 🤖 AI-Powered Fraud Detection

Uses a trained XGBoost machine learning model to analyze transaction information and classify transactions as legitimate or potentially fraudulent.

### 🔍 Real-Time Transaction Analysis

Users can enter transaction features such as `V1`–`V28`, transaction time, and transaction amount to generate an instant fraud prediction.

### ⚠️ Risk Assessment

Transactions are assigned a risk level based on the model's fraud probability:

- **LOW**
- **MEDIUM**
- **HIGH**

### 🎲 Demo Transaction Generator

Provides randomly selected legitimate and fraudulent transactions from a compact demonstration dataset for testing the prediction system.

### 📊 Analytics Dashboard

Provides model and dataset insights through interactive charts and statistical metrics.

### 📈 Fraud Detection Trend

Displays transaction fraud probability trends from the current analysis session.

### 🧾 Detection History

Maintains a session-based history of analyzed transactions including:

- Transaction amount
- Fraud probability
- Prediction result
- Risk level
- Detection time

### 📂 Dataset Analyzer

Allows users to upload supported CSV datasets and analyze:

- Total transactions
- Fraudulent transactions
- Legitimate transactions
- Fraud rate
- Total transaction amount
- Average transaction amount

### 📥 Sample Dataset Downloads

Provides downloadable sample datasets that can be used with the Dataset Analyzer.

### 🖥️ Interactive Web Dashboard

Provides separate sections for:

- Dashboard
- Fraud Analyzer
- Analytics
- ML Model

### 📱 Responsive Interface

Designed to work across desktop and mobile screen sizes with a modern dark fintech dashboard interface.

## Tech Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- Axios
- React Router

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- REST APIs

### Machine Learning

- XGBoost
- Scikit-learn
- NumPy
- Pandas
- Joblib

### Models Evaluated

- Logistic Regression
- Random Forest
- XGBoost

### Tools & Deployment

- Git
- GitHub
- Vercel
- Render
- VS Code

## 💳 Credit Card Fraud Detection | React.js, FastAPI, XGBoost

• Developed an AI-powered credit card fraud detection platform capable of analyzing transaction data and identifying potentially fraudulent activity.

• Built a FastAPI backend providing REST APIs for transaction prediction, demo transactions, analytics, and CSV dataset analysis.

• Implemented an XGBoost-based fraud detection model to handle highly imbalanced credit card transaction data.

• Evaluated Logistic Regression, Random Forest, and XGBoost models using Precision, Recall, F1-score, ROC-AUC, and PR-AUC.

• Designed a responsive React.js dashboard with transaction analysis, fraud risk indicators, analytics charts, model metrics, and detection history.

• Implemented session-based transaction history and fraud probability trend visualization using Recharts.

• Added CSV dataset analysis functionality to calculate transaction statistics and fraud distribution for supported datasets.

• Integrated API communication between the React frontend and FastAPI backend using Axios.

## Machine Learning Performance

The models were evaluated on the credit card fraud dataset using multiple classification metrics.

### XGBoost

| Metric    |      Score |
| --------- | ---------: |
| ROC-AUC   | **0.9826** |
| PR-AUC    | **0.8795** |
| Precision |   **0.86** |
| Recall    |   **0.85** |
| F1-Score  |   **0.86** |

### Random Forest

| Metric    |      Score |
| --------- | ---------: |
| ROC-AUC   | **0.9613** |
| PR-AUC    | **0.8669** |
| Precision |   **0.93** |
| Recall    |   **0.79** |
| F1-Score  |   **0.85** |

### Logistic Regression

| Metric    |      Score |
| --------- | ---------: |
| ROC-AUC   | **0.9721** |
| PR-AUC    | **0.7190** |
| Precision |   **0.06** |
| Recall    |   **0.92** |
| F1-Score  |   **0.11** |

## Dataset

The primary model was trained using the Credit Card Fraud Detection dataset containing:

- **284,807 transactions**
- **492 fraudulent transactions**
- **284,315 legitimate transactions**
- **30 input features + target class**
- Fraud rate of approximately **0.17%**

The dataset contains severe class imbalance, so class weighting was incorporated during model training.

### Dataset Source

[Kaggle - Credit Card Fraud Detection](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)

## Usage

### Dashboard

1. Open the application.
2. View the overall fraud detection dashboard.
3. Review session statistics and recent detections.
4. Navigate to the Fraud Analyzer to analyze transactions.

### Fraud Analyzer

1. Open **Fraud Analyzer**.
2. Enter transaction values.
3. Provide `Time`, `V1`–`V28`, and `Amount`.
4. Click **Analyze Transaction**.
5. The system returns:
   - Fraud prediction
   - Fraud probability
   - Risk level
6. The transaction is added to the detection history.

### Demo Transaction

1. Open the Fraud Analyzer.
2. Click **Load Demo Transaction**.
3. The system loads a randomly selected demonstration transaction.
4. Run the analysis to view the model prediction.

### Dataset Analyzer

1. Open the Dataset Analyzer section.
2. Download one of the supported sample datasets or select your own CSV file.
3. Click **Analyze Dataset**.
4. View:
   - Total transactions
   - Fraud count
   - Legitimate count
   - Fraud rate
   - Transaction amount statistics

### Analytics

1. Open the **Analytics** section.
2. Review model performance metrics.
3. Inspect confusion matrix and classification statistics.
4. Analyze fraud detection performance.

### ML Model

1. Open the **ML Model** section.
2. Review the XGBoost engine information.
3. View model performance metrics and detection capabilities
