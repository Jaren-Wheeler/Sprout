/*
==================================================
useDiet Hook
--------------------------------------------------
Central state controller for the Diet feature.

Responsibilities:
- Load diet data from backend
- Manage logged food items
- Manage presets
- Manage fitness profile stats
- Provide derived nutrition totals
==================================================
*/

import { useEffect, useMemo, useState } from 'react';

import {
  addDietItem,
  addPresetItem,
  createDiet,
  deleteDiet,
  deleteDietItem,
  deletePresetItem,
  getDietItems,
  getDiets,
  getFitnessInfo,
  getPresetItems,
  getWeightHistory,
  updateFitnessInfo,
} from '../../../api/health';

export default function useDiet() {
  /*
  --------------------------------------------------
  Feature state
  --------------------------------------------------
  */
  const [diets, setDiets] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState(null);

  /*
  --------------------------------------------------
  User selection state
  --------------------------------------------------
  */
  const [dietItems, setDietItems] = useState([]); // Logged food items
  const [selectedDate, setSelectedDate] = useState(new Date()); // Controls what day the user is seeing

  useEffect(() => {
    if (selectedDiet?.id) {
      localStorage.setItem('selectedDietId', String(selectedDiet.id));
    }
  }, [selectedDiet]);

  /*
  --------------------------------------------------
  User profile data
  --------------------------------------------------
  */
  const [stats, setStats] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [presets, setPresets] = useState([]);

  /*
  --------------------------------------------------
  UI state
  --------------------------------------------------
  */
  const [loading, setLoading] = useState(true);
  const [presetsLoading, setPresetsLoading] = useState(false);

  /*
  --------------------------------------------------
  Derived data
  --------------------------------------------------
  */

  const itemsForSelectedDate = useMemo(() => {
    const day = selectedDate.toDateString();

    return dietItems.filter(
      (item) => new Date(item.loggedAt).toDateString() === day
    );
  }, [dietItems, selectedDate]);

  /*
  --------------------------------------------------
  Calculate daily macro totals
  --------------------------------------------------
  */

  const dailyTotals = useMemo(() => {
    return itemsForSelectedDate.reduce(
      (totals, item) => {
        totals.calories += item.calories || 0;
        totals.protein += item.protein || 0;
        totals.carbs += item.carbs || 0;
        totals.fat += item.fat || 0;

        return totals;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    );
  }, [itemsForSelectedDate]);

  /*
  --------------------------------------------------
  Combine goals + consumed values
  --------------------------------------------------
  */

  const dailyStats = useMemo(() => {
    if (!stats) return null;

    return {
      calorieGoal: stats.calorieGoal || 0,
      proteinGoal: stats.proteinGoal || 0,
      carbsGoal: stats.carbsGoal || 0,
      fatGoal: stats.fatGoal || 0,
      currentWeight: stats.currentWeight || null,
      goalWeight: stats.goalWeight || null,

      caloriesConsumed: dailyTotals.calories,
      proteinConsumed: dailyTotals.protein,
      carbsConsumed: dailyTotals.carbs,
      fatConsumed: dailyTotals.fat,
    };
  }, [stats, dailyTotals]);

  /*
  --------------------------------------------------
  Shared reload helpers
  --------------------------------------------------
  */

  async function loadDiets() {
    try {
      const data = await getDiets();
      setDiets(data || []);
    } catch (err) {
      console.error('Failed to load diets', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadPresetsForDiet(dietId) {
    if (!dietId) {
      setPresets([]);
      return;
    }

    try {
      setPresetsLoading(true);
      const data = await getPresetItems(dietId);
      setPresets(data || []);
    } catch (err) {
      console.error('Failed to load presets', err);
      setPresets([]);
    } finally {
      setPresetsLoading(false);
    }
  }

  async function loadItemsForDiet(dietId) {
    if (!dietId) {
      setDietItems([]);
      return;
    }

    try {
      const items = await getDietItems(dietId);
      setDietItems(items || []);
    } catch (err) {
      console.error('Failed to load diet items', err);
      setDietItems([]);
    }
  }

  async function loadStats() {
    try {
      const info = await getFitnessInfo();
      setStats(info || null);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  }

  async function loadWeightHistory() {
    try {
      const data = await getWeightHistory();
      setWeightHistory(data || []);
    } catch (err) {
      console.error('Failed to load weight history');
    }
  }

  async function refreshDietData() {
    try {
      const dietsData = await getDiets();
      const nextDiets = dietsData || [];
      setDiets(nextDiets);

      let nextSelectedDiet = null;

      if (selectedDiet?.id) {
        nextSelectedDiet =
          nextDiets.find((d) => d.id === selectedDiet.id) || null;
      }

      if (!nextSelectedDiet) {
        const savedId = localStorage.getItem('selectedDietId');

        if (savedId) {
          nextSelectedDiet =
            nextDiets.find((d) => String(d.id) === savedId) || null;
        }
      }

      if (!nextSelectedDiet && nextDiets.length > 0) {
        nextSelectedDiet = nextDiets[0];
      }

      setSelectedDiet(nextSelectedDiet);

      if (!nextSelectedDiet) {
        setDietItems([]);
        setPresets([]);
        localStorage.removeItem('selectedDietId');
      } else {
        await Promise.all([
          loadItemsForDiet(nextSelectedDiet.id),
          loadPresetsForDiet(nextSelectedDiet.id),
        ]);
      }

      await Promise.all([loadStats(), loadWeightHistory()]);
    } catch (err) {
      console.error('Failed to refresh diet data', err);
    }
  }

  /*
  --------------------------------------------------
  Load diets/Presets
  --------------------------------------------------
  */

  useEffect(() => {
    loadDiets();
  }, []);

  useEffect(() => {
    loadPresetsForDiet(selectedDiet?.id);
  }, [selectedDiet]);

  /*
  --------------------------------------------------
  Select first diet automatically
  --------------------------------------------------
  */

  useEffect(() => {
    if (diets.length === 0 || selectedDiet) return;

    const savedId = localStorage.getItem('selectedDietId');

    if (savedId) {
      const savedDiet = diets.find((d) => String(d.id) === savedId);

      if (savedDiet) {
        setSelectedDiet(savedDiet);
        return;
      }
    }

    setSelectedDiet(diets[0]);
  }, [diets, selectedDiet]);

  /*
  --------------------------------------------------
  Load diet items
  Ensures state change when user selects a different
  diet
  --------------------------------------------------
  */

  useEffect(() => {
    loadItemsForDiet(selectedDiet?.id);
  }, [selectedDiet]);

  /*
  --------------------------------------------------
  Load fitness stats
  --------------------------------------------------
  */

  useEffect(() => {
    loadStats();
  }, []);

  /*
  --------------------------------------------------
  Load weight history
  --------------------------------------------------
  */

  useEffect(() => {
    loadWeightHistory();
  }, []);

  /*
  --------------------------------------------------
  Refresh after chatbot-driven Diet updates
  --------------------------------------------------
  */

  useEffect(() => {
    function handleDietDataUpdated() {
      refreshDietData();
    }

    window.addEventListener('dietDataUpdated', handleDietDataUpdated);

    return () => {
      window.removeEventListener('dietDataUpdated', handleDietDataUpdated);
    };
  }, [selectedDiet]);

  /*
  --------------------------------------------------
  Diet actions
  Responsibilities:
  - Create a diet
  - Delete a Diet
  --------------------------------------------------
  */

  async function createNewDiet(data) {
    const newDiet = await createDiet(data);

    setDiets((prev) => [...prev, newDiet]);
    setSelectedDiet(newDiet);
  }

  async function deleteDietById(id) {
    await deleteDiet(id);

    setDiets((prev) => {
      const remaining = prev.filter((d) => d.id !== id);

      if (remaining.length === 0) {
        setSelectedDiet(null);
        setDietItems([]);
        setPresets([]);

        localStorage.removeItem('selectedDietId');
      } else if (selectedDiet?.id === id) {
        setSelectedDiet(remaining[0]);
      }

      return remaining;
    });
  }

  /*
  --------------------------------------------------
  Diet item actions
  Responsibilities:
  - Add food to log
  - Delete food from log
  - Add preset food to log
  --------------------------------------------------
  */

  async function addDietItemToDiet(data) {
    if (!selectedDiet?.id) return;

    const item = await addDietItem({
      ...data,
      id: selectedDiet.id,
    });

    setDietItems((prev) => [item, ...prev]);
  }

  async function deleteDietItemFromDiet(itemId) {
    if (!selectedDiet?.id) return;

    await deleteDietItem(selectedDiet.id, itemId);

    setDietItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  async function usePreset(preset) {
    if (!selectedDiet?.id) return;

    const item = await addDietItem({
      id: selectedDiet.id,
      name: preset.name,
      meal: preset.meal,

      quantity: preset.quantity,
      unit: preset.unit,

      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
      sugar: preset.sugar,

      loggedAt: selectedDate,
    });

    setDietItems((prev) => [item, ...prev]);
  }

  /*
  --------------------------------------------------
  Fitness profile actions
  Responsibilities:
  - Update macro goals
  - Update weight history
  --------------------------------------------------
  */

  async function updateGoals(data) {
    await updateFitnessInfo(data);

    const updatedStats = await getFitnessInfo();
    setStats(updatedStats);

    const updatedHistory = await getWeightHistory();
    setWeightHistory(updatedHistory);
  }

  /*
  --------------------------------------------------
  Preset actions
  Responsibilities:
  - Create a preset
  - Delete a preset
  --------------------------------------------------
  */

  async function addPreset(data) {
    if (!selectedDiet?.id) return;

    const preset = await addPresetItem({
      ...data,
      id: selectedDiet.id,
    });

    setPresets((prev) => [preset, ...prev]);
  }

  async function removePreset(presetId) {
    if (!selectedDiet?.id) return;

    await deletePresetItem(selectedDiet.id, presetId);

    setPresets((prev) => prev.filter((p) => p.id !== presetId));
  }

  /*
  --------------------------------------------------
  Hook API
  --------------------------------------------------
  */

  return {
    diets,
    selectedDiet,
    setSelectedDiet,

    dietItems,
    itemsForSelectedDate,

    addDietItem: addDietItemToDiet,
    deleteDietItem: deleteDietItemFromDiet,

    selectedDate,
    setSelectedDate,

    stats: dailyStats,
    weightHistory,
    loading,

    createNewDiet,
    deleteDietById,
    updateGoals,

    presets,
    presetsLoading,

    usePreset,
    removePreset,
    addPreset,
  };
}