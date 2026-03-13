import { useState } from 'react';
import { Link } from 'react-router-dom';

import { sendChatMessage } from '../../../api/chatbot';
import { updateFitnessInfo } from '../../../api/health';

import sproutLogo from '../../../assets/Logo.png';
import Sprout from '../../../components/chatbot/Sprout';

import CreateDietModal from '../modals/CreateDietModal';
import CreateFitnessProfileModal from '../modals/createFitnessProfileModal';

import DietCharts from '../components/charts/DietCharts';
import DailyFoodLogCard from '../components/food/DailyFoodLogCard';
import DietLayout from '../components/layout/DietLayout';
import MealPlanningCard from '../components/meals/MealPlanningCard';
import DietStats from '../components/stats/DietStats';

import useDiet from '../hooks/useDiet';

export default function DietDashboard() {
  const {
    diets,
    selectedDiet,
    setSelectedDiet,
    dietItems,
    itemsForSelectedDate,
    addDietItemLocal,
    removeDietItemLocal,
    stats,
    weightHistory,
    selectedDate,
    setSelectedDate,
    loading,
    createNewDiet,
    deleteDietById,
  } = useDiet();

  const [showModal, setShowModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);

  if (loading) {
    return <div className="p-6">Loading diets...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F3EED9] text-[#3B2F2F]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* FITNESS PROFILE MODAL */}
        {showGoalsModal && (
          <CreateFitnessProfileModal
            isOpen={showGoalsModal}
            onClose={() => setShowGoalsModal(false)}
            onSubmit={async (data) => {
              await updateFitnessInfo(data);
              setShowGoalsModal(false);
            }}
          />
        )}

        {/* NO DIETS STATE */}
        {diets.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg border p-10 text-center w-[420px]">
              <h2 className="text-xl font-semibold mb-3">No Diets Yet</h2>

              <p className="text-gray-500 mb-6">
                Create your first diet plan to start tracking meals and
                nutrition.
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

        {/* MAIN DIET LAYOUT */}
        <DietLayout
          header={
            <header className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Link to="/dashboard">
                    <img src={sproutLogo} className="h-16" alt="Sprout logo" />
                  </Link>
                  Diet
                </h1>

                <p className="text-[#6B5E5E]">
                  Track meals, nutrition, and health goals
                </p>
              </div>

              <button
                className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:scale-105 transition"
                onClick={() => setShowModal(true)}
              >
                + Create Diet
              </button>
            </header>
          }
          summary={
            <DietStats
              stats={stats}
              onEditGoals={() => setShowGoalsModal(true)}
            />
          }
          mainLeft={
            selectedDiet && (
              <DailyFoodLogCard
                diet={selectedDiet}
                diets={diets}
                onSelectDiet={setSelectedDiet}
                onDeleteDiet={deleteDietById}
                openCreateDiet={() => setShowModal(true)}
                items={itemsForSelectedDate}
                addDietItemLocal={addDietItemLocal}
                removeDietItemLocal={removeDietItemLocal}
                date={selectedDate}
                setDate={setSelectedDate}
              />
            )
          }
          mainRight={
            selectedDiet && (
              <MealPlanningCard
                diet={selectedDiet}
                onAddDietItem={addDietItemLocal}
              />
            )
          }
          charts={
            selectedDiet && (
              <DietCharts
                dietItems={itemsForSelectedDate}
                weightHistory={weightHistory}
              />
            )
          }
        />
      </div>

      {/* SPROUT CHATBOT */}
      <Sprout onSend={sendChatMessage} />
    </div>
  );
}
