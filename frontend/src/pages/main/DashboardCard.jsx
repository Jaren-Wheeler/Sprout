import { useNavigate } from "react-router-dom";

export default function DashboardCard({ title, route, children }) {

  const navigate = useNavigate();

  const tilt = ["rotate-[-1deg]", "rotate-[1deg]", "rotate-[-0.5deg]", "rotate-[0.5deg]"];

  return (
    <div
      className={`p-6 flex flex-col h-[280px] cursor-pointer
                bg-[#f8ff94] border-4 border-[#8c4a18] rounded-xl
                shadow-[8px_8px_0px_0px_rgba(254,240,138,0.3)]
                transition-all duration-200
                hover:scale-[1.03] hover:bg-[#fce477]
                ${tilt[Math.floor(Math.random() * tilt.length)]}`}
      onClick={() => navigate(route)}
    >

      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-amber-900">{title}</h2>
        <span className="text-xs text-orange-600">View →</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>

    </div>
  );
}