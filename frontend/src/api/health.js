import { apiFetch } from "./client";

// =====================================================
// Health API Module
// =====================================================

/* ---------- Fitness Info ---------- */

export const getFitnessInfo = () => {
  return apiFetch("/api/health/fitness");
};

export const updateFitnessInfo = (data) => {
  return apiFetch("/api/health/fitness", {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

/* ---------- Workouts ---------- */

export const getWorkouts = () => {
  return apiFetch("/api/health/workouts");
};

export const createWorkout = (data) => {
  return apiFetch("/api/health/workouts", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const deleteWorkout = (id) => {
  return apiFetch(`/api/health/workouts/${id}`, {
    method: "DELETE"
  });
};

/* ---------- Diets ---------- */

export const getDiets = () => {
  return apiFetch("/api/health/diets");
};

export const createDiet = (data) => {
  return apiFetch("/api/health/diets", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const deleteDiet = (id) => {
  return apiFetch(`/api/health/diets/${id}`, {
    method: "DELETE"
  });
};
