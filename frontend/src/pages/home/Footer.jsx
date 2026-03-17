import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate();
  return (
    <>
      {/* Smooth transition into footer */}
      <div className="h-6 bg-gradient-to-b from-transparent to-[#d6ccb5]" />

      <footer className="w-full border-t border-[#cbbf9e] bg-[#d6ccb5]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          
          {/* Left: Branding */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold text-[#5b3a29] flex items-center justify-center md:justify-start gap-2 font-[Poppins]">
              🌱 Sprout
            </h2>
            <p className="text-sm text-[#7a6a58] mt-2 max-w-xs font-[Inter]">
              Grow higher. The sky’s the limit.
            </p>
          </div>

          {/* Middle: Links */}
          <div className="flex gap-12 text-sm text-[#5b3a29] font-[Inter]">
            <div className="flex flex-col gap-2">
              <span className="font-medium mb-1 font-[Poppins]">Product</span>
              <a href="#" className="hover:text-green-700 transition">Features</a>
              <a href="#" className="hover:text-green-700 transition">Pricing</a>
              <a href="#" className="hover:text-green-700 transition">Updates</a>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium mb-1 font-[Poppins]">Company</span>
              <a href="#" className="hover:text-green-700 transition">About</a>
              <a href="#" className="hover:text-green-700 transition">Contact</a>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
            <p className="text-sm text-[#7a6a58] max-w-[220px] font-[Inter]">
              Start organizing your life today.
            </p>
            <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-sm font-[Inter] font-medium"
                    onClick={() => navigate("/signup")}>
              Get Started
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#cbbf9e] text-center py-4 text-xs text-[#8a7a66] font-[Inter]">
          © {new Date().getFullYear()} Sprout. All rights reserved.
        </div>
      </footer>
    </>
  );
}