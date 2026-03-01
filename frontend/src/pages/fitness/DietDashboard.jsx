import { useEffect, useState } from "react";
import { getDiets, createDiet, deleteDiet, getFitnessInfo , getDietItems, updateFitnessInfo, getWeightHistory} from "../../api/health";
import Sprout from "../../components/chatbot/Sprout";
import DietStats from "./DietStats";
import CreateDietModal from "./CreateDietModal";
import DietPage from "./DietPage";
import CreateFitnessProfileModal from "./CreateFitnessProfileModal";

export default function DietDashboard() {

    const [diets, setDiets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState([]);
    const [selectedDiet, setSelectedDiet] = useState(null);
    const [dietItems, setDietItems] = useState([]);
    const [showGoalsModal, setShowGoalsModal] = useState(false);
    const [weightHistory, setWeightHistory] = useState([]);

    async function handleDeleteDiet(id) {
        try {
            await deleteDiet(id);
            setDiets(prev => prev.filter(d => d.id !== id));
        } catch(err) {
            console.error("Failed to delete diet", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function handleFitnessInfo(){
            try {
                const info = await getFitnessInfo();
                setStats(info || []);
            } catch (err) {
                console.error("Failed to fetch stats");
            }
        }
       
        handleFitnessInfo();
    }, []);

 
    useEffect(() => {
        async function loadDiets() {
            try {
                const data = await getDiets();
                console.log(data);
                setDiets(data || []);
            } catch (err) {
                console.error("Failed to load diets", err);
            } finally {
                setLoading(false);
            }
        }

        loadDiets();
    }, []);

    useEffect(() => {
        if (diets.length > 0 && !selectedDiet) {
            setSelectedDiet(diets[0]);
        }
    }, [diets]);

    useEffect(() => {
        async function loadItems() {
            if (!selectedDiet?.id) return;

            try {
                const items = await getDietItems(selectedDiet.id);
                setDietItems(items || []);
            } catch (err) {
                console.error("Failed to load diet items", err);
            }
        }

        loadItems();
    }, [selectedDiet]);

    useEffect(() => {
        async function loadWeightHistory() {
            try {
                const data = await getWeightHistory();
                console.log("Fetched weight history:", data); // debug
                setWeightHistory(data || []);
            } catch (err) {
                console.error("Failed to load weight history", err);
            }
        }

        loadWeightHistory();
    }, []);

    if (loading) return <div className="p-6">Loading diets...</div>;

    return (
        <div className="min-h-[calc(100vh-160px)] p-6">
        
            {/* HEADER */}
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Diet Dashboard</h1>

                <button className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:scale-105 transition"
                    onClick={() => setShowModal(true)}
                >
                    + Create Diet
                </button>
            </div>
            
            <DietStats
                stats={stats}
                diet={selectedDiet}
                dietItems={dietItems}
                onEditGoals={() => setShowGoalsModal(true)}
                />

            {showGoalsModal && (
            <CreateFitnessProfileModal
                onClose={() => setShowGoalsModal(false)}
                onSubmit={async (data) => {
                    await updateFitnessInfo(data);

                    const updatedHistory = await getWeightHistory();
                    setWeightHistory(updatedHistory);

                    setShowGoalsModal(false);
                }}
            />
            )}

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
                         onClick={() => setShowModal(true)}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
                    >
                        + Create Diet
                    </button>

                    </div>

                </div>
            )}
        
            <CreateDietModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onCreate={async (data) => {
                    const newDiet = await createDiet(data);

                    //add new card instantly
                    setDiets(prev => [...prev, newDiet]);
                    setShowModal(false);
                }}
            />
            
        
            <DietPage 
                diet={selectedDiet} 
                diets={diets}
                dietItems={dietItems}
                setDietItems={setDietItems}
                onDeleteDiet={handleDeleteDiet}
                onSelectDiet={setSelectedDiet}
                weightHistory={weightHistory}
            />
    
            <Sprout></Sprout>
        </div>
    );
}
