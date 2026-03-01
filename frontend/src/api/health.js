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

export const getWeightHistory = () => {
  return apiFetch("/api/health/weight-history");
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

export const getDietById = () => {
  return apiFetch(`/api/health/diets/${id}`);
}

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

export const addDietItem = (data) => {
  return apiFetch(`/api/health/diets/${data.id}/diet-items`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export const getDietItems = (id) => {
  return apiFetch(`/api/health/diets/${id}/diet-items`);
}

export const deleteDietItem = (id, itemId) => {
  return apiFetch(`/api/health/diets/${id}/diet-items/${itemId}`, {
    method: "DELETE"
  });
}

export const getPresetItems = (id) => {
  return apiFetch(`/api/health/diets/${id}/preset-items`);
}

export const addPresetItem = (data) => {
  return apiFetch(`/api/health/diets/${data.id}/preset-items`, {
      method: "POST",
      body: JSON.stringify(data)
    });
}

export const deletePresetItem = (id, itemId) => {
  return apiFetch(`/api/health/diets/${id}/preset-items/${itemId}`, {
      method: "DELETE"
    });
}