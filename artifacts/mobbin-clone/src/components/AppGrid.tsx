const apps = [
  { name: "Instagram", category: "Social", color: "#E1306C", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=600&fit=crop&q=80" },
  { name: "Spotify", category: "Music", color: "#1DB954", img: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=300&h=600&fit=crop&q=80" },
  { name: "Airbnb", category: "Travel", color: "#FF5A5F", img: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=300&h=600&fit=crop&q=80" },
  { name: "Notion", category: "Productivity", color: "#000000", img: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=300&h=600&fit=crop&q=80" },
  { name: "Twitter", category: "Social", color: "#1DA1F2", img: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=300&h=600&fit=crop&q=80" },
  { name: "Figma", category: "Design", color: "#F24E1E", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=600&fit=crop&q=80" },
  { name: "Stripe", category: "Finance", color: "#635BFF", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop&q=80" },
  { name: "Linear", category: "Productivity", color: "#5E6AD2", img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&h=600&fit=crop&q=80" },
  { name: "Duolingo", category: "Education", color: "#58CC02", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=600&fit=crop&q=80" },
  { name: "Headspace", category: "Wellness", color: "#FF6900", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=600&fit=crop&q=80" },
  { name: "TikTok", category: "Social", color: "#010101", img: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&h=600&fit=crop&q=80" },
  { name: "Uber", category: "Transport", color: "#000000", img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&h=600&fit=crop&q=80" },
];

function AppCard({ app }: { app: typeof apps[0] }) {
  return (
    <div className="group relative cursor-pointer">
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
        <div className="relative overflow-hidden" style={{ height: "260px" }}>
          <img
            src={app.img}
            alt={app.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
              Save
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex-shrink-0"
              style={{ backgroundColor: app.color }}
            />
            <div>
              <div className="text-sm font-semibold text-gray-900 leading-none">{app.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{app.category}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppGrid() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-[#1D1F27] tracking-tight mb-4">
            Explore thousands of apps
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Browse and filter through the world's largest curated UI reference library.
          </p>
        </div>

        <div className="relative mb-10">
          <div className="flex items-center gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="search"
                placeholder="Search screens, flows, apps..."
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all bg-white shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              {["All", "iOS", "Android", "Web"].map((t) => (
                <button
                  key={t}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    t === "All"
                      ? "bg-[#1D1F27] text-white"
                      : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {apps.map((app) => (
            <AppCard key={app.name} app={app} />
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 px-6 py-3 rounded-xl transition-colors hover:bg-gray-50"
          >
            Browse all 3,000+ apps
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M4 8a.5.5 0 01.5-.5h5.793L8.146 5.354a.5.5 0 11.708-.708l3 3a.5.5 0 010 .708l-3 3a.5.5 0 01-.708-.708L10.293 8.5H4.5A.5.5 0 014 8z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
