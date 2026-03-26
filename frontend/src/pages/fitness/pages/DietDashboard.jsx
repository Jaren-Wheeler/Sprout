import { useState } from 'react';

import { sendChatMessage } from '../../../api/chatbot';
import background from '../../../assets/bg.png';
import Sprout from '../../../components/chatbot/Sprout';
import CreateDietModal from '../modals/CreateDietModal';
import CreateFitnessProfileModal from '../modals/createFitnessProfileModal';
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
      className="sprout-app-shell"
      style={{ backgroundImage: `linear-gradient(180deg, rgba(255,253,249,0.5), rgba(247,241,225,0.72)), url(${background})` }}
    >
      <div className="sprout-page-wrap">
        <AppLayout title="Diet Journal">
          <div className="space-y-6">
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

            <CreateDietModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onCreate={async (data) => {
                await createNewDiet(data);
                setShowModal(false);
              }}
            />

            <section className="sprout-page-hero">
              <div className="relative z-10">
                <div>
                  <span className="sprout-page-kicker">Nutrition tracker</span>
                  <h1 className="sprout-page-title">Diet Journal</h1>
                  <p className="sprout-page-description">
                    Cleaner tracking for meals, macros, and progress, with a softer paper-board feel instead of a busy backdrop.
                  </p>
                </div>
              </div>
            </section>

            <DietLayout
              header={null}
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
        </AppLayout>
      </div>

      <Sprout onSend={sendChatMessage} />
    </div>
  );
}
