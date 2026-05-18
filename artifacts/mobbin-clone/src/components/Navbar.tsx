import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="8" fill="#1D1F27"/>
                <path d="M8 20V10.5L14 7L20 10.5V20" stroke="#FF6B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 20V14.5L14 13L17 14.5V20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[1.15rem] font-bold text-[#1D1F27] tracking-tight">mobbin</span>
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">Browse</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</a>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="text-sm text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Log in
            </a>
            <a href="#" className="text-sm font-semibold text-white bg-[#1D1F27] hover:bg-[#2d2f3a] px-4 py-2 rounded-xl transition-colors">
              Get started for free
            </a>
          </div>
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              {mobileOpen ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              ) : (
                <path fillRule="evenodd" clipRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          <a href="#" className="text-sm font-medium text-gray-700">Browse</a>
          <a href="#pricing" className="text-sm font-medium text-gray-700">Pricing</a>
          <hr className="border-gray-100" />
          <a href="#" className="text-sm font-medium text-gray-700">Log in</a>
          <a href="#" className="text-sm font-semibold text-white bg-[#1D1F27] px-4 py-2 rounded-xl text-center">
            Get started for free
          </a>
        </div>
      )}
    </header>
  );
}
