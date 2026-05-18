const phones = [
  {
    color: "#F0F0F0",
    screens: [
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=400&fit=crop",
    ],
  },
];

const appScreenshots = [
  { id: 1, img: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=220&h=440&fit=crop&q=80", app: "Instagram", rotate: "-6deg", top: "0px", left: "0px" },
  { id: 2, img: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=220&h=440&fit=crop&q=80", app: "Twitter", rotate: "3deg", top: "40px", left: "160px" },
  { id: 3, img: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=220&h=440&fit=crop&q=80", app: "Spotify", rotate: "-3deg", top: "60px", left: "320px" },
  { id: 4, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=220&h=440&fit=crop&q=80", app: "Airbnb", rotate: "5deg", top: "20px", left: "480px" },
  { id: 5, img: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=220&h=440&fit=crop&q=80", app: "Notion", rotate: "-4deg", top: "80px", left: "640px" },
];

function PhoneMockup({ img, rotate, top, left }: { img: string; rotate: string; top: string; left: string }) {
  return (
    <div
      className="absolute"
      style={{ transform: `rotate(${rotate})`, top, left, width: "160px" }}
    >
      <div
        className="rounded-[28px] overflow-hidden shadow-2xl border-[6px] border-[#1D1F27]"
        style={{ width: "160px", height: "320px" }}
      >
        <img src={img} alt="" className="w-full h-full object-cover" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#1D1F27] rounded-b-xl" />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="text-base">✨</span>
            New: AI-powered screen search is here
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#1D1F27] leading-[1.08] tracking-tight mb-6">
            The world's biggest library of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B2B] to-[#FF9900]">
              mobile & web
            </span>{" "}
            design references
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-2xl mx-auto">
            Save hours of UI & UX research with our library of 600,000+ fully searchable
            mobile & web app screenshots.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1D1F27] hover:bg-[#2d2f3a] text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              Get started for free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M4 8a.5.5 0 01.5-.5h5.793L8.146 5.354a.5.5 0 11.708-.708l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L10.293 8.5H4.5A.5.5 0 014 8z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 px-6 py-3.5 rounded-xl transition-colors"
            >
              Browse screens
            </a>
          </div>

          <p className="mt-4 text-xs text-gray-400">No credit card required · Free plan available</p>
        </div>
      </div>

      <div className="relative mx-auto" style={{ maxWidth: "1200px", height: "420px", overflow: "hidden" }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 60%, white 100%)",
            zIndex: 10,
          }}
        />
        <div className="absolute inset-x-0 top-0 flex justify-center gap-6 px-8">
          {[
            { img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=400&fit=crop&q=80", rotate: "-8deg", mt: "0px" },
            { img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=400&fit=crop&q=80", rotate: "3deg", mt: "50px" },
            { img: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=200&h=400&fit=crop&q=80", rotate: "-4deg", mt: "20px" },
            { img: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=200&h=400&fit=crop&q=80", rotate: "6deg", mt: "60px" },
            { img: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=200&h=400&fit=crop&q=80", rotate: "-5deg", mt: "10px" },
            { img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=400&fit=crop&q=80", rotate: "4deg", mt: "40px" },
            { img: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=200&h=400&fit=crop&q=80", rotate: "-3deg", mt: "25px" },
          ].map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{
                transform: `rotate(${p.rotate})`,
                marginTop: p.mt,
                width: "140px",
              }}
            >
              <div
                className="rounded-[24px] overflow-hidden shadow-2xl border-[5px] border-[#1D1F27] relative"
                style={{ width: "140px", height: "290px" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#1D1F27] rounded-b-lg z-10" />
                <img src={p.img} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
