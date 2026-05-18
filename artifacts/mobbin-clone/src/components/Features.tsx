const features = [
  {
    tag: "Search",
    title: "Find any UI pattern in seconds",
    description:
      "Search by keyword, flow, or use our AI-powered visual search to find exactly the screen you're looking for — from 600,000+ real app screenshots.",
    img: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=600&fit=crop&q=80",
    accent: "#FF6B2B",
    reverse: false,
    bullets: [
      "Full-text search across all screens",
      "AI visual similarity search",
      "Filter by platform, category, flow type",
    ],
  },
  {
    tag: "Collections",
    title: "Save and organise your inspiration",
    description:
      "Bookmark screens to collections and keep your research organised. Export to Figma, Notion, or share with your team instantly.",
    img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop&q=80",
    accent: "#5E6AD2",
    reverse: true,
    bullets: [
      "Personal & team collections",
      "One-click export to Figma",
      "Share with a link",
    ],
  },
  {
    tag: "Flows",
    title: "Study complete user journeys",
    description:
      "Go beyond single screens — follow entire user flows like onboarding, checkout, or sign-up across hundreds of top apps.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80",
    accent: "#1DB954",
    reverse: false,
    bullets: [
      "Onboarding, checkout & more",
      "Compare flows across apps",
      "Annotate and comment",
    ],
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
        {features.map((f, i) => (
          <div
            key={i}
            className={`flex flex-col ${f.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-16`}
          >
            <div className="flex-1 max-w-lg">
              <div
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
                style={{ backgroundColor: f.accent + "18", color: f.accent }}
              >
                {f.tag}
              </div>
              <h2 className="text-4xl font-extrabold text-[#1D1F27] tracking-tight leading-tight mb-5">
                {f.title}
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                {f.description}
              </p>
              <ul className="space-y-3 mb-8">
                {f.bullets.map((b, bi) => (
                  <li key={bi} className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: f.accent }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                        <path d="M1.5 5L3.5 7L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: f.accent }}
              >
                Learn more
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M4 8a.5.5 0 01.5-.5h5.793L8.146 5.354a.5.5 0 11.708-.708l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L10.293 8.5H4.5A.5.5 0 014 8z" />
                </svg>
              </a>
            </div>
            <div className="flex-1 w-full">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                <img
                  src={f.img}
                  alt={f.title}
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
