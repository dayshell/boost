import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "Get started with the basics. No credit card required.",
    cta: "Get started for free",
    ctaStyle: "border border-gray-200 text-gray-800 hover:bg-gray-50",
    features: [
      "100 screens per month",
      "Limited search",
      "iOS & Android",
      "Public collections",
    ],
    notIncluded: ["Web app screens", "Unlimited search", "Team collections", "Figma plugin"],
  },
  {
    name: "Pro",
    price: { monthly: 14, annual: 10 },
    description: "For individual designers who need full access.",
    cta: "Start free trial",
    ctaStyle: "bg-[#1D1F27] text-white hover:bg-[#2d2f3a]",
    highlight: true,
    badge: "Most popular",
    features: [
      "Unlimited screens",
      "Full search & filters",
      "iOS, Android & Web",
      "Unlimited collections",
      "Figma plugin",
      "CSV & image export",
    ],
    notIncluded: ["Team workspaces", "Priority support"],
  },
  {
    name: "Teams",
    price: { monthly: 20, annual: 15 },
    description: "For design teams who collaborate and share research.",
    cta: "Start free trial",
    ctaStyle: "border border-gray-200 text-gray-800 hover:bg-gray-50",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Shared collections",
      "Admin controls",
      "Priority support",
      "SSO (coming soon)",
    ],
    notIncluded: [],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-[#1D1F27] tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8">
            Start for free. Upgrade when you're ready.
          </p>
          <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !annual ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                annual ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              Annual
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                Save 30%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 border ${
                plan.highlight
                  ? "border-[#1D1F27] shadow-2xl bg-[#1D1F27]"
                  : "border-gray-200 bg-white shadow-sm"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1 mb-2">
                  <span className={`text-5xl font-extrabold ${plan.highlight ? "text-white" : "text-[#1D1F27]"}`}>
                    ${annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className={`text-sm mb-2 ${plan.highlight ? "text-gray-400" : "text-gray-400"}`}>
                      /mo
                    </span>
                  )}
                </div>
                <p className={`text-sm ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}>
                  {plan.description}
                </p>
              </div>

              <a
                href="#"
                className={`block text-center text-sm font-semibold py-3 rounded-xl mb-8 transition-colors ${plan.ctaStyle} ${
                  plan.highlight
                    ? "!bg-white !text-[#1D1F27] hover:!bg-gray-100"
                    : ""
                }`}
              >
                {plan.cta}
              </a>

              <ul className="space-y-3">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? "bg-orange-500" : "bg-green-500"}`}>
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                        <path d="M1.5 5L3.5 7L8.5 2.5" />
                      </svg>
                    </div>
                    <span className={`text-sm ${plan.highlight ? "text-gray-200" : "text-gray-700"}`}>{f}</span>
                  </li>
                ))}
                {plan.notIncluded?.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-3 opacity-40">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200">
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round">
                        <path d="M2 2L8 8M8 2L2 8" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
