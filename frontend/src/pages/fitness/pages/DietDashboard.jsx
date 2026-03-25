import { useState } from 'react';
import { Link } from 'react-router-dom';

import { sendChatMessage } from '../../../api/chatbot';

import background from '../../../assets/bg.png';
import note4 from '../../../assets/note4.png';

import Sprout from '../../../components/chatbot/Sprout';

import CreateDietModal from '../modals/CreateDietModal';
import CreateFitnessProfileModal from '../modals/CreateFitnessProfileModal';

import DietCharts from '../components/charts/DietCharts';
import DailyFoodLogCard from '../components/food/DailyFoodLogCard';
import DietLayout from '../components/layout/DietLayout';
import MealPlanningCard from '../components/meals/MealPlanningCard';
import DietStats from '../components/stats/DietStats';

import useDiet from '../hooks/useDiet';
import AppLayout from '@/components/AppLayout';

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
  <div
    className="min-h-screen w-full bg-cover bg-center bg-fixed bg-[#F3EED9]"
    style={{ backgroundImage: `url(${background})` }}
  >
    <AppLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6 pl-10 pr-10">

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
                <header className="flex flex-col items-center justify-center">
                  <div 
                    className="flex flex-col items-center justify-center"
                    style={{ 
                      backgroundImage: `url(${note4})`,
                      backgroundSize: '90% 65%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      minWidth: '400px',
                      minHeight: '250px',
                      textAlign: 'center',
                      filter: 'drop-shadow(8px 8px 12px rgba(0,0,0,0.1))'
                    }}
                  >
                  <h1 className="text-5xl font-black text-[#3B2F2F]">Diet Journal</h1>
                  <p className="text-[#6B5E5E] italic">Track your progress and nutrition</p>
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
      </div>
    </AppLayout>

    {/* SPROUT */}
    <Sprout onSend={sendChatMessage} />
  </div>
);
}
