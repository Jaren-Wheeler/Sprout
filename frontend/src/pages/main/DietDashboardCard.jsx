import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";

export default function DietDashboardCard() {

  const [diet, setDiet] = useState(null);

  useEffect(() => {
    fetchDiet();
  }, []);

  async function fetchDiet() {
    try {
      const res = await fetch("/api/diet/today");
      const data = await res.json();
      setDiet(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DashboardCard title="Diet" route="/diet">

      {diet ? (
        <>
          <p><strong>Calories:</strong> {diet.calories}</p>
          <p><strong>Protein:</strong> {diet.protein}g</p>
          <p><strong>Last Meal:</strong> {diet.lastMeal}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}

    </DashboardCard>
  );
}