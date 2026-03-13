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
  const [diets, setDiets] = useState([]);
  const [selectedDiet, setSelectedDiet] = useState(null);

  const [dietItems, setDietItems] = useState([]);

  const [stats, setStats] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [presets, setPresets] = useState([]);
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

      caloriesConsumed: dailyTotals.calories,
      proteinConsumed: dailyTotals.protein,
      carbsConsumed: dailyTotals.carbs,
      fatConsumed: dailyTotals.fat,
    };
  }, [stats, dailyTotals]);

  /*
  --------------------------------------------------
  Load diets/Presets
  --------------------------------------------------
  */

  useEffect(() => {
    async function load() {
      try {
        const data = await getDiets();
        setDiets(data || []);
      } catch (err) {
        console.error('Failed to load diets', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    async function loadPresets() {
      if (!selectedDiet?.id) return;

      try {
        setPresetsLoading(true);
        const data = await getPresetItems(selectedDiet.id);
        setPresets(data || []);
      } catch (err) {
        console.error('Failed to load presets', err);
        setPresets([]);
      } finally {
        setPresetsLoading(false);
      }
    }

    loadPresets();
  }, [selectedDiet]);

  /*
  --------------------------------------------------
  Select first diet automatically
  --------------------------------------------------
  */

  useEffect(() => {
    if (diets.length > 0 && !selectedDiet) {
      setSelectedDiet(diets[0]);
    }
  }, [diets, selectedDiet]);

  /*
  --------------------------------------------------
  Load diet items
  --------------------------------------------------
  */

  useEffect(() => {
    async function loadItems() {
      if (!selectedDiet?.id) return;

      try {
        const items = await getDietItems(selectedDiet.id);
        setDietItems(items || []);
      } catch (err) {
        console.error('Failed to load diet items', err);
      }
    }

    loadItems();
  }, [selectedDiet]);

  /*
  --------------------------------------------------
  Load fitness stats
  --------------------------------------------------
  */

  useEffect(() => {
    async function loadStats() {
      try {
        const info = await getFitnessInfo();
        setStats(info || null);
      } catch (err) {
        console.error('Failed to fetch stats');
      }
    }

    loadStats();
  }, []);

  /*
  --------------------------------------------------
  Load weight history
  --------------------------------------------------
  */

  useEffect(() => {
    async function loadWeightHistory() {
      try {
        const data = await getWeightHistory();
        setWeightHistory(data || []);
      } catch (err) {
        console.error('Failed to load weight history');
      }
    }

    loadWeightHistory();
  }, []);

  /*
  --------------------------------------------------
  Actions
  --------------------------------------------------
  */

  async function createNewDiet(data) {
    const newDiet = await createDiet(data);
    setDiets((prev) => [...prev, newDiet]);
  }

  async function deleteDietById(id) {
    await deleteDiet(id);

    setDiets((prev) => {
      const remaining = prev.filter((d) => d.id !== id);

      if (selectedDiet?.id === id) {
        setSelectedDiet(remaining[0] || null);
      }

      return remaining;
    });
  }

  async function addDietItemToDiet(data) {
    if (!selectedDiet?.id) return;

    const item = await addDietItem({
      ...data,
      id: selectedDiet.id,
    });

    setDietItems((prev) => [item, ...prev]);
  }
  async function updateGoals(data) {
    await updateFitnessInfo(data);

    const updatedStats = await getFitnessInfo();
    setStats(updatedStats);

    const updatedHistory = await getWeightHistory();
    setWeightHistory(updatedHistory);
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

      loggedAt: selectedDate, // <-- FIX
    });

    setDietItems((prev) => [item, ...prev]);
  }

  async function removePreset(presetId) {
    if (!selectedDiet?.id) return;

    await deletePresetItem(selectedDiet.id, presetId);

    setPresets((prev) => prev.filter((p) => p.id !== presetId));
  }

  async function addPreset(data) {
    if (!selectedDiet?.id) return;

    const preset = await addPresetItem({
      ...data,
      id: selectedDiet.id,
    });

    setPresets((prev) => [preset, ...prev]);
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
