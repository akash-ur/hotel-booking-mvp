"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Newsletter signup — self-contained UI only. No backend endpoint exists
 * for this in the current scope (not part of the hotel/booking module),
 * so submission just shows a local confirmation state rather than
 * calling an API.
 */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 to-blue-900 px-6 sm:px-14 py-14 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gold-400/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl" />

        <Mail className="h-8 w-8 text-gold-300 mx-auto mb-4 relative" />
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white relative">
          Get Exclusive Deals in Your Inbox
        </h2>
        <p className="text-white/70 mt-3 max-w-md mx-auto relative">
          Subscribe for members-only rates and early access to new
          destinations.
        </p>

        {submitted ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-gold-300 font-medium relative">
            <CheckCircle2 className="h-5 w-5" />
            You&apos;re subscribed — thank you!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative"
          >
            <Input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-white/95 border-0"
            />
            <Button
              type="submit"
              className="h-12 px-6 bg-gold-500 hover:bg-gold-600 text-blue-950 font-semibold whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
