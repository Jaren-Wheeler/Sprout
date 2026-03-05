import { useState } from 'react';
import useDiet from './useDiet';

import Sprout from '../../components/chatbot/Sprout';
import DietStats from './DietStats';
import CreateDietModal from './CreateDietModal';
import DietPage from './DietPage';
import CreateFitnessProfileModal from './CreateFitnessProfileModal';

export default function DietDashboard() {
  const {
    diets,
    selectedDiet,
    setSelectedDiet,
    dietItems,
    setDietItems,
    stats,
    weightHistory,
    loading,
    createNewDiet,
    deleteDietById,
    updateGoals,
  } = useDiet();

  const [showModal, setShowModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  if (loading) return <div className="p-6">Loading diets...</div>;

  return (
    <div className="min-h-[calc(100vh-160px)] p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Diet Dashboard</h1>

        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:scale-105 transition"
          onClick={() => setShowModal(true)}
        >
          + Create Diet
        </button>
      </div>

      {/* STATS */}
      <DietStats
        stats={stats}
        diet={selectedDiet}
        dietItems={dietItems}
        onEditGoals={() => setShowGoalsModal(true)}
      />

      {/* GOALS MODAL */}
      {showGoalsModal && (
        <CreateFitnessProfileModal
          onClose={() => setShowGoalsModal(false)}
          onSubmit={async (data) => {
            await updateGoals(data);
            setShowGoalsModal(false);
          }}
        />
      )}

      {/* EMPTY STATE */}
      {diets.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border p-10 text-center w-[420px]">
            <h2 className="text-xl font-semibold mb-3">No Diets Yet</h2>

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

      {/* CREATE DIET MODAL */}
      <CreateDietModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={async (data) => {
          await createNewDiet(data);
          setShowModal(false);
        }}
      />

      {/* DIET PAGE */}
      <DietPage
        diet={selectedDiet}
        diets={diets}
        dietItems={dietItems}
        setDietItems={setDietItems}
        onDeleteDiet={deleteDietById}
        onSelectDiet={setSelectedDiet}
        weightHistory={weightHistory}
      />

      {/* CHATBOT */}
      <Sprout />
    </div>
  );
}
