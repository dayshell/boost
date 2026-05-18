const testimonials = [
  {
    quote: "Mobbin has become an essential part of my design process. I use it every single day to find UI patterns and get inspired before starting a new feature.",
    name: "Sarah Chen",
    title: "Product Designer at Figma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80",
  },
  {
    quote: "The quality and breadth of the UI library is unmatched. Being able to search for a specific flow like 'empty state' and see how 50+ apps handle it is incredibly valuable.",
    name: "Marcus Johnson",
    title: "Lead Designer at Stripe",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80",
  },
  {
    quote: "I've tried many design inspiration tools but Mobbin is leagues ahead. The search is incredibly powerful and the library is updated so frequently.",
    name: "Priya Patel",
    title: "UX Designer at Airbnb",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80",
  },
  {
    quote: "Our design team saves hours every week thanks to Mobbin. The collections feature alone is worth the price — we use it to align on design direction with stakeholders.",
    name: "Tom Williams",
    title: "Head of Design at Linear",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&q=80",
  },
  {
    quote: "Mobbin is the only tool I recommend to every designer I mentor. The depth of real-world UI patterns you can study here is absolutely incredible.",
    name: "Aiko Tanaka",
    title: "Senior Product Designer at Notion",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&h=80&fit=crop&q=80",
  },
  {
    quote: "From onboarding flows to empty states, Mobbin has helped me benchmark our product against the best in class. The AI search is a game-changer.",
    name: "David Kim",
    title: "Design Lead at Loom",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#FF6B2B">
          <path d="M8 1l1.854 3.755L14 5.382l-3 2.924.708 4.126L8 10.25l-3.708 2.182L5 8.306 2 5.382l4.146-.627L8 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-orange-600 font-semibold text-sm uppercase tracking-wider mb-3">Loved by designers</p>
          <h2 className="text-4xl font-extrabold text-[#1D1F27] tracking-tight mb-4">
            Trusted by 100,000+ designers
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            From indie makers to teams at the world's top companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <StarRating />
              <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
