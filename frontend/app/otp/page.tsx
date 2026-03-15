"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

const API_BASE_URL = "http://127.0.0.1:8000";

function OtpVerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [tempLoginToken, setTempLoginToken] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("tempLoginToken");
      setTempLoginToken(token || "");
    }

    if (!email || !token) {
      setError("Invalid session. Please go back and try again.");
    }
  }, [email, token]);

  const handleVerifyOtp = async () => {
    setError("");

    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          otp: otp,
          token: tempLoginToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid OTP");
      }

      const data = await response.json();
      console.log("OTP Verified:", data);

      Cookies.set("authToken", data.token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      alert("OTP Verified Successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) handleVerifyOtp();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Verify OTP</h1>
          <p className="text-gray-600">
            Enter the OTP sent to <b>{email}</b>
          </p>
        </div>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ""));
            setError("");
          }}
          onKeyDown={handleKeyPress}
          placeholder="Enter 6-digit OTP"
          disabled={loading}
          className={`w-full px-4 py-3 border-2 rounded-lg text-center tracking-[0.4em] text-lg
            ${error ? "border-red-500 bg-red-50 text-red-700" : "border-gray-300 bg-white text-gray-800"}
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />

        {error && (
          <div className="mt-3 flex items-center text-red-600 text-sm gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleVerifyOtp}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-lg text-white font-medium shadow-lg
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"}
          `}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </div>
    </div>
  );
}

export default function OtpVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OtpVerifyContent />
    </Suspense>
  );
}