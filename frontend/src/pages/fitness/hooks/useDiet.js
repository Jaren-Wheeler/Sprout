import { isSameDay } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import {
  createDiet,
  deleteDiet,
  getDietItems,
  getDiets,
  getFitnessInfo,
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

  /*
  --------------------------------------------------
  Derived data
  --------------------------------------------------
  */

  const itemsForSelectedDate = useMemo(() => {
    return (dietItems || []).filter((item) =>
      isSameDay(new Date(item.loggedAt), selectedDate)
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
  Load diets
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
  Local State Actions
  --------------------------------------------------
  */

  function addDietItemLocal(item) {
    setDietItems((prev) => [item, ...prev]);
  }

  function removeDietItemLocal(itemId) {
    setDietItems((prev) => prev.filter((item) => item.id !== itemId));
  }

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

  async function updateGoals(data) {
    await updateFitnessInfo(data);

    const updatedStats = await getFitnessInfo();
    setStats(updatedStats);

    const updatedHistory = await getWeightHistory();
    setWeightHistory(updatedHistory);
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

    addDietItemLocal,
    removeDietItemLocal,

    selectedDate,
    setSelectedDate,

    stats: dailyStats,
    weightHistory,
    loading,

    createNewDiet,
    deleteDietById,
    updateGoals,
  };
}
