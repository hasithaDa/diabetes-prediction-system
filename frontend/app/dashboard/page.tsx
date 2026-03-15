"use client";

import React, { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

interface AiResource {
  title: string;
  url: string;
}

interface PredictionResponse {
  prediction: number;
  diagnosis: string;
  ai_resources: AiResource[];
}

export default function PredictionPage() {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    hypertension: "",
    heart_disease: "",
    bmi: "",
    HbA1c_level: "",
    blood_glucose_level: "",
    smoking_history_numeric: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleSubmit = async () => {
    setError("");
    setResult(null);

    // If file is uploaded, use PDF endpoint
    if (file) {
      setLoading(true);
      try {
        const formDataObj = new FormData();
        formDataObj.append("file", file);

        const response = await fetch(`${API_BASE_URL}/api/predict/pdf`, {
          method: "POST",
          body: formDataObj,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || `HTTP error: ${response.status}`);
        }

        const data: PredictionResponse = await response.json();
        setResult(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Prediction failed");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Validate numeric form fields
    for (const key in formData) {
      if (formData[key as keyof typeof formData] === "") {
        setError("All fields are required.");
        return;
      }
    }

    // Submit numeric form data
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(formData).map(([k, v]) => [k, Number(v)])
          )
        ),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || `HTTP error: ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Diabetes Prediction
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1 capitalize">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type="number"
                name={key}
                value={formData[key as keyof typeof formData]}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg outline-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-200 focus:border-green-400"
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="text-gray-700 font-medium mb-1">Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="px-3 py-2 border rounded-lg w-full outline-none text-gray-800 focus:ring-2 focus:ring-green-200 focus:border-green-400"
          />
        </div>

        {error && <p className="text-red-600 mt-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-lg font-medium shadow-lg transition-all flex items-center justify-center gap-2
            ${loading
              ? "bg-green-200 text-gray-800 cursor-not-allowed"
              : "bg-green-600 text-gray-100 hover:bg-green-700 active:scale-[0.98]"
            }`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-gray-800"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {loading ? "Predicting..." : "Predict"}
        </button>

        {result && (
          <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-left">
            <p className="text-lg font-semibold text-gray-800">
              Diagnosis:{" "}
              <span className={result.prediction ? "text-red-600" : "text-green-600"}>
                {result.diagnosis}
              </span>
            </p>

            {result.ai_resources.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2 text-gray-800">Resources:</p>
                <ul className="list-disc list-inside text-blue-600">
                  {result.ai_resources.map((res, idx) => (
                    <li key={idx}>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {res.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
