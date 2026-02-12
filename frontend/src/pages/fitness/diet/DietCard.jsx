import { useNavigate } from "react-router-dom";

export default function DietCard({ diet, featured = false }) {
  const navigate = useNavigate();

  return (
        <button
            onClick={() => navigate(`/diet/${diet.id}`)}
            className={`
                text-left transition-all duration-200
                rounded-3xl border bg-white shadow-sm hover:shadow-xl

                ${featured
                ? "w-[520px] p-10"
                : "w-full p-6"}
                `}
        >

        {/* TITLE */}
        <h2 className={featured ? "text-2xl font-semibold" : "text-lg font-semibold"}>
            {diet.name}
        </h2>
            
        {diet.description && (
            <p className="text-sm text-gray-500 mt-1">
                {diet.description}
            </p>
        )}
        
        {/* ACTIVE BADGE */}
        {diet.isActive && (
            <span className="inline-block mt-4 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-md">
            Active Diet
            </span>
        )}
        </button>
    );
}
