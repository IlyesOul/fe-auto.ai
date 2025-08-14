import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRouter } from "next/router";

export default function Verify() {
  const recaptchaRef = useRef();
  const router = useRouter();

  const handleVerify = (value) => {
    if (value) {
      localStorage.setItem("verified", "true");
      router.push("/"); // go to chat
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded shadow-lg text-center">
        <h1 className="text-xl font-bold mb-4">Please verify you are human</h1>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          onChange={handleVerify}
          size="normal"
        />
      </div>
    </div>
  );
}
