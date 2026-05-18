const stats = [
  { value: "600,000+", label: "Screens" },
  { value: "3,000+", label: "Apps" },
  { value: "iOS", label: "Platform" },
  { value: "Android", label: "Platform" },
  { value: "Web", label: "Platform" },
];

export default function Stats() {
  return (
    <section className="bg-[#1D1F27] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {[
            { value: "600,000+", label: "Screens in the library" },
            { value: "3,000+", label: "Apps covered" },
            { value: "iOS · Android · Web", label: "All platforms" },
            { value: "Updated daily", label: "Fresh content" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              {i > 0 && <div className="hidden sm:block w-px h-8 bg-white/10" />}
              <div className="text-center sm:text-left">
                <div className="text-white font-bold text-lg leading-none">{s.value}</div>
                <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
