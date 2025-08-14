import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const onReCAPTCHAChange = (token) => {
    setCaptchaToken(token);
  };

  const sendPrompt = async () => {
    if (!captchaToken) {
      alert("Please complete the reCAPTCHA first.");
      return;
    }

    setLoading(true);

    const res = await fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, token: captchaToken }),
    });

    const data = await res.json();
    setResponse(data.response || data.detail || "Error");
    setLoading(false);
  };

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

        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          onChange={onReCAPTCHAChange}
        />

        <button
          onClick={sendPrompt}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>

        {response && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <strong>GPT-4 says:</strong>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
