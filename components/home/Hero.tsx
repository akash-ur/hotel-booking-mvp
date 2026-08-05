/**
 * Full-screen hero banner with a large background image and a dark
 * gradient overlay for text legibility. Pure presentation — the search
 * box itself lives in app/page.tsx so it can visually float across the
 * boundary between the hero and the section below it.
 */
export default function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
        alt="Luxury hotel"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-950/50 to-blue-950/80" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block text-gold-300 tracking-[0.3em] text-xs sm:text-sm font-medium uppercase mb-4">
          Luxury &amp; Comfort, Redefined
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-white leading-tight">
          Find Your Perfect
          <br />
          Escape
        </h1>
        <p className="text-white/80 text-base sm:text-lg mt-5 max-w-xl mx-auto">
          Handpicked hotels and resorts across the world&apos;s most sought-after
          destinations — book with confidence.
        </p>
      </div>
    </section>
  );
}
