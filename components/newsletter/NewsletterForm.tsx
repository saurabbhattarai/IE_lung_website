"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

interface FormResponse {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    // Client-side pre-validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatusMessage({
        type: "error",
        text: "Please enter your email address.",
      });
      return;
    }

    if (!consent) {
      setStatusMessage({
        type: "error",
        text: "Please agree to receive updates to subscribe.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          consent,
        }),
      });

      const data: FormResponse = await response.json();

      if (response.ok && data.success) {
        setStatusMessage({
          type: "success",
          text:
            data.message ||
            "Thank you for subscribing! You are now signed up for our newsletter.",
        });
        setEmail("");
        setConsent(false);
      } else {
        setStatusMessage({
          type: "error",
          text:
            data.error ||
            "Unable to subscribe at this time. Please try again later.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
        {/* Email Input */}
        <div>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isSubmitting}
            autoComplete="email"
            aria-label="Email address for newsletter"
            required
            className="w-full bg-white/10 border border-white/15 text-white placeholder:text-gray-400 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all disabled:opacity-50"
          />
        </div>

        {/* Subscribe Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-white px-3 py-2 rounded-lg font-medium text-xs transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <span>Subscribe</span>
              <Send className="w-3 h-3" />
            </>
          )}
        </button>

        {/* Consent Checkbox */}
        <div className="flex items-start gap-2 pt-0.5">
          <input
            id="newsletter-consent"
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={isSubmitting}
            className="mt-0.5 w-3.5 h-3.5 rounded border-white/30 text-accent focus:ring-accent focus:ring-offset-0 bg-white/10 accent-accent cursor-pointer disabled:cursor-not-allowed shrink-0"
          />
          <label
            htmlFor="newsletter-consent"
            className="text-[11px] text-gray-300 leading-normal cursor-pointer select-none"
          >
            I agree to receive clinic news and respiratory health updates from IE Lung.
          </label>
        </div>

        {/* Status / Feedback Message */}
        {statusMessage && (
          <div
            role="alert"
            className={`flex items-start gap-1.5 text-xs rounded-md p-2 mt-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                : "bg-red-950/60 text-red-300 border border-red-500/30"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            )}
            <span className="text-[11px] leading-tight">{statusMessage.text}</span>
          </div>
        )}
      </form>
    </div>
  );
}
