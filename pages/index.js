"use client";
import { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Home() {
  const [verified, setVerified] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  // Check if user is already verified
  useEffect(() => {
    const passed = localStorage.getItem("verified");
    if (passed === "true") {
      setVerified(true);
      setShowChat(true);
    }
  }, []);

  // Called when user clicks the CAPTCHA checkbox
  const handleVerify = (token) => {
    console.log('token = ',token)
    if (token) {
      localStorage.setItem("verified", "true");
      setRecaptchaToken(token);
      setVerified(true);
      setShowChat(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('recaptchaToken = ',recaptchaToken)

    if (!verified || !recaptchaToken) {
      alert("Please complete the reCAPTCHA first.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, token: recaptchaToken }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text);
        setResponse("Error: Backend did not return JSON.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        console.error("Backend error:", data);
        setResponse(data.detail || "Unknown error");
        setLoading(false);
        return;
      }

      setResponse(
        typeof data.response === "object" ? JSON.stringify(data.response, null, 2) : data.response
      );
      setPrompt("");
    } catch (error) {
      console.error("Fetch failed:", error);
      setResponse("Error: Unable to reach the server.");
    }

    setLoading(false);
  };

  console.log('verified',verified)

  if (!showChat) {
    // Verification screen
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-6 bg-white rounded shadow-lg text-center">
          <h1 className="text-xl font-bold mb-4">Please verify you are human</h1>
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={handleVerify}
            ref={recaptchaRef}
            size="normal"
          />
        </div>
      </div>
    );
  }

  // Chat screen
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold">Ask GPT-4</h1>
        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          placeholder="Enter your question..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
        {response && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <strong>GPT-4 says:</strong>
            <pre>{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
