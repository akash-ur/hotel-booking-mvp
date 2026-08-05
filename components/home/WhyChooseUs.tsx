import { ShieldCheck, BadgePercent, Headphones, CalendarCheck } from "lucide-react";

const features = [
  {
    icon: BadgePercent,
    title: "Best Price Guarantee",
    description:
      "Find a lower price elsewhere and we'll match it — no hidden fees, ever.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Properties",
    description:
      "Every hotel is inspected and verified for quality before it's listed.",
  },
  {
    icon: CalendarCheck,
    title: "Flexible Cancellation",
    description: "Plans change — cancel or reschedule most bookings for free.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our support team is available around the clock, wherever you are.",
  },
];

/**
 * "Why Choose Us" trust-building section. Purely static — no data or
 * API dependency.
 */
export default function WhyChooseUs() {
  return (
    <section id="why-us" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-14">
        <span className="text-blue-700 text-xs font-semibold tracking-[0.25em] uppercase">
          Our Promise
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
          Why Choose Luxe Stays
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="text-center rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
              <Icon className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
