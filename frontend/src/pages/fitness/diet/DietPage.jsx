import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiets } from "../../../api/health";
import Sprout from "../../../components/chatbot/Sprout";

export default function DietPage() {
    const navigate = useNavigate();

    const [diets, setDiets] = useState([]);
    const [loading, setLoading] = useState(true);

    function handleCreateDiet() {
        console.log("Create diet clicked");
    }

    useEffect(() => {
        async function loadDiets() {
        try {
            const data = await getDiets();
            setDiets(data || []);
        } catch (err) {
            console.error("Failed to load diets", err);
        } finally {
            setLoading(false);
        }
        }

        loadDiets();
    }, []);

    if (loading) return <div className="p-6">Loading diets...</div>;

    return (
        <div className="min-h-[calc(100vh-160px)] p-6">
        
            {/* HEADER */}
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">My Diets</h1>

                <button className="bg-gray-800 text-white px-4 py-2 rounded-xl">
                + Create Diet
                </button>
            </div>

            {/* LIVE STATS SECTION */}
            <div className="rounded-2xl border bg-white p-8 text-center">
                <p>Your stats (IMPORT SOME FROM THE FITNESS GOALS)</p>
            </div>
            
            {/*DIET*/}
            {diets.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-20">

                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border p-10 text-center w-[420px]">
                    
                    <h2 className="text-xl font-semibold mb-3">
                        No Diets Yet
                    </h2>

                    <p className="text-gray-500 mb-6">
                        Create your first diet plan to start tracking meals and nutrition.
                    </p>

                    <button
                        onClick={handleCreateDiet}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
                    >
                        + Create Diet
                    </button>

                    </div>

                </div>
            )}

            {/* DIET CARDS */}
            <div className="grid grid-cols-3 gap-4">
                {diets.map(diet => (
                <button
                    key={diet.id}
                    onClick={() => navigate(`/diet/${diet.id}`)}
                    className="rounded-2xl border bg-white p-6 shadow-sm text-left hover:shadow-md transition"
                >
                    <h2 className="font-semibold text-lg">{diet.name}</h2>
                    <p className="text-sm text-gray-500">
                    {diet.calorieGoal} kcal
                    </p>
                </button>
                ))}
            </div>
            <Sprout></Sprout>
        </div>
    );
}
