import { useNavigate } from "react-router-dom";

export default function DashboardCard({ title, route, children }) {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex h-[280px] cursor-pointer flex-col overflow-hidden rounded-[30px] border border-[rgba(83,56,31,0.16)] bg-[linear-gradient(180deg,rgba(253,249,241,0.92)_0%,rgba(246,239,226,0.84)_100%)] p-7 shadow-[0_20px_40px_rgba(48,31,15,0.22)] backdrop-blur-[4px] transition-all duration-200 hover:-translate-y-[4px] hover:shadow-[0_28px_52px_rgba(48,31,15,0.28)]"
      onClick={() => navigate(route)}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_42%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(143,104,58,0.06))] pointer-events-none" />

      <div className="relative z-10 mb-5">
        <h2 className="text-[1.6rem] font-semibold leading-none tracking-[-0.02em] text-[#5b3013]">{title}</h2>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center text-[#714019]">
        {children}
      </div>
    </div>
  );
}
