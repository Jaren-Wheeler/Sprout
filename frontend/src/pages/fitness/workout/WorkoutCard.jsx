import { useNavigate } from "react-router-dom";


export default function WorkoutCard({ workout, featured = false, onDelete }) {
    const navigate = useNavigate();

    return (
        <div  
            className={`
                    text-left transition-all duration-200
                    rounded-3xl border bg-white shadow-sm hover:shadow-xl
                    flex 
                    ${featured
                    ? "w-[520px] p-10"
                    : "w-full p-6"}
                    `}>
            <div
                className="flex w-[90%]"
                onClick={() => navigate(`/workouts/${workout.id}`)}
            >
                <div>
                    {/* TITLE */}
                    <h2 className={featured ? "text-2xl font-semibold" : "text-lg font-semibold"}>
                        {workout.name}
                    </h2> 
                    
                </div>
                
                {workout.description && (
                    <p className="text-sm text-gray-500 mt-1">
                        {workout.description}
                    </p>
                )}

                {/* ACTIVE BADGE */}
                {workout.isActive && (
                    <span className="inline-block mt-4 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-md">
                        Active Workout
                    </span>
                )}
            </div>
            <button className="ml-auto" onClick={() => onDelete(workout.id)}>X</button>
        </div>
      
      
    );
}
