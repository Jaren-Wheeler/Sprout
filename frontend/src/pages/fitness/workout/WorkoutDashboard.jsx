import CreateWorkoutModal from "./CreateWorkoutModal"
import WorkoutCard from "./WorkoutCard";
import WorkoutStats from "./WorkoutStats";
import Sprout from "../../../components/chatbot/Sprout";
import { useEffect, useState } from "react";
import { getWorkouts, createWorkout, deleteWorkout} from '../../../api/health';
export default function WorkoutPage() {

    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState([]);
    
    async function handleDeleteWorkout(id) {
        try {
            await deleteWorkout(id);
            setWorkouts(prev => prev.filter(d => d.id !== id));
        } catch(err) {
            console.error("Failed to delete workout", err);
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
        async function loadWorkouts() {
            try {
                const data = await getWorkouts();
                console.log(data);
                setWorkouts(data || {});
            } catch (err) {
                console.error("Failed to load workouts", err);
            } finally {
                setLoading(false);
            }
        }

        loadWorkouts();
    }, []);

    if (loading) return <div className="p-6">Loading Workouts...</div>;

    return (
        <div className="min-h-[calc(100vh-160px)] p-6">
        
            {/* HEADER */}
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Workout Dashboard</h1>

                <button className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:scale-105 transition"
                    onClick={() => setShowModal(true)}
                >
                    + Create Workout
                </button>
            </div>
            
            <WorkoutStats stats={stats}></WorkoutStats>

            {/*WORKOUT*/}
            {workouts.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-20">

                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border p-10 text-center w-[420px]">
                    
                    <h2 className="text-xl font-semibold mb-3">
                        No Workouts Yet
                    </h2>

                    <p className="text-gray-500 mb-6">
                        Create your first workout plan and start your fitness journey!
                    </p>

                    <button
                         onClick={() => setShowModal(true)}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
                    >
                        + Create Workout
                    </button>

                    </div>

                </div>
            )}
            
            {/* ONE WORKOUT → FEATURED LAYOUT */}
            {workouts.length === 1 && (
                <div className="flex justify-center mt-10">
                    <WorkoutCard workout={workouts[0]} featured onDelete={handleDeleteWorkout}/>
                </div>
            )}

            {/* MULTIPLE WORKOUTS → GRID */}
            {workouts.length > 1 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {workouts.map(workout => (
                    <WorkoutCard key={workout.id} workout={workout} onDelete={handleDeleteWorkout}/>
                    ))}
                </div>
            )}

            <CreateWorkoutModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onCreate={async (data) => {
                    const newWorkout = await createWorkout(data);

                    //add new card instantly
                    setWorkouts(prev => [...prev, newWorkout]);
                    setShowModal(false);
                }}
            />
            <Sprout></Sprout>
        </div>
    );
};