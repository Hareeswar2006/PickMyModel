# **PickMyModel 🧠⚙️**  
_Choosing models so you don’t have to._

> **PickMyModel** is an end-to-end AutoML system that analyzes user datasets, determines the machine learning problem type, and recommends suitable models using **meta-learning**, reducing manual trial-and-error in model selection.

---

## 🚀 What This Project Does

PickMyModel automates the **most time-consuming early stages of ML workflows**:

1. Understands the dataset   
2. Cleans and preprocesses the data consistently  
3. Trains multiple candidate models  
4. Learns from past datasets to **predict good models for future datasets**

The system is designed to **learn from experience**, not just train models blindly.

---

## 🧠 Core Ideas Behind PickMyModel

- **Meta-features** describe datasets (size, missingness, skewness, correlations, etc.)
- **Meta-learning** uses these features to predict which ML algorithms are likely to perform well
- Over time, the system improves recommendations without exhaustive benchmarking

---

## 🛠️ Tech Stack

### Backend & ML
- Python  
- FastAPI  
- scikit-learn  
- pandas, NumPy  
- Matplotlib  

### Frontend
- React  
- JavaScript  
- CSS  

---

## ✨ Key Features

### 📊 Automatic Problem Detection
- Identifies **Regression vs Classification**
- Validates dataset structure and target column

### 🔎 Rich Meta-Feature Extraction
Extracts **40+ dataset characteristics**, including:
- Dataset size & dimensionality  
- Missing value statistics  
- Feature type ratios (numeric vs categorical)  
- Distribution metrics (skewness, kurtosis)  
- Correlation statistics  
- Target distribution properties  

### 🧹 Robust Preprocessing Pipelines
Reusable, production-safe pipelines for:
- Missing value imputation  
- Outlier capping  
- Encoding (One-Hot)  
- Feature scaling  
- Zero-variance feature removal  

Used **consistently for both training and inference**.

### 🤖 Model Training & Evaluation
- Trains multiple baseline ML models per dataset  
- Selects the best model using validation metrics  
- Saves deployable artifacts:
  - Cleaned dataset  
  - Preprocessor  
  - Trained model  

### 🧠 Meta-Learning Engine
- Logs dataset meta-features + best model outcomes  
- Trains a **meta-model** to predict the best algorithm  
- Achieved **~60% accuracy** in best-model prediction

> Even partial accuracy significantly reduces search space in real AutoML workflows.

### 🔮 Model Playground
- Interactive UI to test trained models  
- Accepts **raw feature inputs**  
- Applies preprocessing automatically  
- Supports:
  - Regression predictions  
  - Classification predictions with **probability scores**  

---

## 🏗️ System Architecture

User Dataset
->
Validation & Problem Detection
->
Meta-Feature Extraction
->
Preprocessing Pipeline
-> 
Model Training & Evaluation
->
Best Model Selection
->
Meta-Dataset Logging
->
Meta-Model Learning


## RUN COMMANDS
- uvicorn main:app --reload --host 0.0.0.0 --port 8000
- npm run dev

## 👨‍💻 Author

Nallabantu Hareeswar

