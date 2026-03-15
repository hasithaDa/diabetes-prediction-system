"use client";
import React, { useState } from 'react';
import { Mail, AlertCircle } from 'lucide-react';
import Cookies from "js-cookie";  
const API_BASE_URL = 'http://127.0.0.1:8000';

export default function EmailPagePreview() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendEmail = async () => {
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! ${response.status}`);
      }

      const data = await response.json();

      Cookies.set("tempLoginToken", data.token, {
        expires: 1,       // expires in 1 day
        secure: true,
        sameSite: "strict",
      });

      window.location.href = `/otp?email=${encodeURIComponent(email)}`;

    } catch (error) {
      console.error("Login init failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleSendEmail();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Enter your email to receive a verification code</p>
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyPress}
            placeholder="you@example.com"
            disabled={loading}
            className={`w-full px-4 py-3 border-2 rounded-lg transition-all outline-none text-black
              ${error 
                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                : 'border-gray-300 bg-white hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />
          {error && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendEmail}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium transition-all
            ${loading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
            }
            text-white shadow-lg shadow-indigo-200
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
              Sending...
            </span>
          ) : (
            'Send OTP'
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-indigo-600 hover:underline font-medium">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="text-indigo-600 hover:underline font-medium">
            Privacy Policy
          </a>
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}