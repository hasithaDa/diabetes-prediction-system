# 🩺 Diabetes Prediction System

A full-stack web application that predicts diabetes risk using machine learning. Users authenticate via email OTP, then submit health metrics or upload a PDF medical report to receive an instant diagnosis with AI-powered resource recommendations.

---

## ✨ Features

- **Email OTP Authentication** — Secure two-factor login flow (email → OTP → dashboard)
- **Manual Health Input** — Enter numeric health metrics via a guided form
- **PDF Upload** — Upload medical records (PDF) for automated data extraction and prediction
- **ML-Powered Prediction** — Backend machine learning model returns a Diabetic / Non-Diabetic diagnosis
- **AI Resource Recommendations** — Curated resources are returned alongside every diagnosis
- **Protected Routes** — Middleware ensures only authenticated users access the dashboard

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────┐
│  Frontend  (Next.js · TypeScript · Tailwind CSS)  │
│                                          │
│  /email  →  /otp  →  /dashboard          │
│  Email login   OTP verify   Predict      │
└─────────────────┬────────────────────────┘
                  │ HTTP (port 8000)
┌─────────────────▼────────────────────────┐
│  Backend  (Python · FastAPI)             │
│                                          │
│  POST /auth/login/init                   │
│  POST /auth/login/verify                 │
│  POST /api/predict        (JSON)         │
│  POST /api/predict/pdf    (multipart)    │
└──────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 16, React 19, TypeScript  |
| Styling    | Tailwind CSS 4                    |
| Icons      | Lucide React                      |
| Auth state | js-cookie                         |
| Backend    | Python, FastAPI                   |
| ML model   | scikit-learn (or similar)         |

---

## 📋 Prerequisites

- **Node.js** 18 or later
- **npm** (or yarn / pnpm)
- **Python** 3.9 or later (for the backend)
- The Python backend API running on `http://127.0.0.1:8000`

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hasithaDa/diabetes-prediction-system.git
cd diabetes-prediction-system
```

### 2. Start the Backend

> The backend is not included in this repository. Set up your Python/FastAPI backend separately and ensure it is running on port **8000** before starting the frontend.

```bash
# Example (adjust to your backend setup)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🔑 Authentication Flow

1. Visit `http://localhost:3000` — you are redirected to `/email`.
2. Enter your registered email address and click **Send OTP**.
3. Check your inbox, then enter the OTP on the `/otp` page.
4. On success, an `authToken` cookie is set and you are redirected to `/dashboard`.

---

## 🧪 Using the Dashboard

### Option A — Manual Form Entry

Fill in the following fields and click **Predict**:

| Field                    | Description                              | Example |
|--------------------------|------------------------------------------|---------|
| `gender`                 | 0 = Female, 1 = Male                     | `1`     |
| `age`                    | Age in years                             | `45`    |
| `hypertension`           | 0 = No, 1 = Yes                          | `0`     |
| `heart_disease`          | 0 = No, 1 = Yes                          | `1`     |
| `bmi`                    | Body Mass Index                          | `27.5`  |
| `HbA1c_level`            | Glycated haemoglobin level (%)           | `6.5`   |
| `blood_glucose_level`    | Fasting blood glucose (mg/dL)            | `140`   |
| `smoking_history_numeric`| 0 = Never, 1 = Former, 2 = Current      | `0`     |

### Option B — PDF Upload

Click **Upload PDF**, select a PDF medical record, and click **Predict**. The backend will extract the relevant values and return a prediction.

### Reading the Result

- 🟢 **Non-Diabetic** — low predicted risk
- 🔴 **Diabetic** — high predicted risk
- A list of curated AI resources is shown below the diagnosis.

---

## 📡 API Endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | `/auth/login/init`    | Send OTP to the provided email       |
| POST   | `/auth/login/verify`  | Verify OTP and receive auth token    |
| POST   | `/api/predict`        | Predict from JSON health metrics     |
| POST   | `/api/predict/pdf`    | Predict from uploaded PDF file       |

---

## 📁 Project Structure

```
diabetes-prediction-system/
└── frontend/                   # Next.js application
    ├── app/
    │   ├── page.tsx            # Root redirect → /email
    │   ├── layout.tsx          # Root layout & metadata
    │   ├── globals.css         # Global Tailwind styles
    │   ├── email/page.tsx      # Email login page
    │   ├── otp/page.tsx        # OTP verification page
    │   └── dashboard/page.tsx  # Prediction dashboard
    ├── middleware.ts            # Route protection middleware
    ├── package.json
    ├── tsconfig.json
    └── next.config.ts
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for license details.
