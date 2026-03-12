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
  Actions
  --------------------------------------------------
  */

  async function createNewDiet(data) {
    const newDiet = await createDiet(data);
    setDiets((prev) => [...prev, newDiet]);
  }

  async function deleteDietById(id) {
    await deleteDiet(id);
    setDiets((prev) => prev.filter((d) => d.id !== id));
  }

  async function updateGoals(data) {
    await updateFitnessInfo(data);

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
    setDietItems,

    selectedDate,
    setSelectedDate,

    stats,
    weightHistory,
    loading,

    createNewDiet,
    deleteDietById,
    updateGoals,
  };
}
