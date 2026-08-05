import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aisha Kapoor",
    location: "Mumbai, India",
    quote:
      "Booking through Luxe Stays was effortless, and the resort in Bali exceeded every expectation. Already planning our next trip.",
    rating: 5,
  },
  {
    name: "Daniel Okafor",
    location: "London, UK",
    quote:
      "The Grand Meridian was stunning — spotless rooms, incredible service, and the whole booking process took less than five minutes.",
    rating: 5,
  },
  {
    name: "Marco Rossi",
    location: "Milan, Italy",
    quote:
      "Alpine Ridge Lodge was the perfect winter escape. Transparent pricing and no surprises at check-in — highly recommend.",
    rating: 4,
  },
];

/**
 * Testimonials section — static content with fictional reviewers, no
 * real public figures referenced.
 */
export default function Testimonials() {
  return (
    <section className="bg-blue-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-gold-300 text-xs font-semibold tracking-[0.25em] uppercase">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
            What Our Guests Say
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < t.rating
                        ? "fill-gold-400 text-gold-400"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6">
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-white/50 text-xs">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
