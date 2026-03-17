import { useState } from 'react';
import { Link } from 'react-router-dom';

import { sendChatMessage } from '../../../api/chatbot';

import sproutLogo from '../../../assets/Logo.png';
import Sprout from '../../../components/chatbot/Sprout';

import CreateDietModal from '../modals/CreateDietModal';
import CreateFitnessProfileModal from '../modals/CreateFitnessProfileModal';

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
    addDietItem,
    deleteDietItem,
    stats,
    weightHistory,
    selectedDate,
    setSelectedDate,
    loading,
    createNewDiet,
    deleteDietById,
    presets,
    presetsLoading,
    usePreset,
    updateGoals,
    removePreset,
    addPreset,
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
              await updateGoals(data);
              setShowGoalsModal(false);
            }}
          />
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
            </header>
          }
          summary={
            <DietStats
              stats={stats}
              onEditGoals={() => setShowGoalsModal(true)}
            />
          }
          mainLeft={
            <DailyFoodLogCard
              diet={selectedDiet}
              diets={diets}
              onSelectDiet={setSelectedDiet}
              onDeleteDiet={deleteDietById}
              openCreateDiet={() => setShowModal(true)}
              items={itemsForSelectedDate}
              addDietItem={addDietItem}
              deleteDietItem={deleteDietItem}
              date={selectedDate}
              setDate={setSelectedDate}
              addPreset={addPreset}
            />
          }
          mainRight={
            <MealPlanningCard
              presets={presets}
              presetsLoading={presetsLoading}
              usePreset={usePreset}
              removePreset={removePreset}
            />
          }
          charts={
            <DietCharts
              dietItems={itemsForSelectedDate}
              weightHistory={weightHistory}
            />
          }
        />
      </div>

      {/* SPROUT CHATBOT */}
      <Sprout onSend={sendChatMessage} />
    </div>
  );
}
