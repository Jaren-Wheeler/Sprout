import { apiFetch } from './client';

export async function searchFoods(query) {
  if (!query?.trim()) return [];

  return apiFetch(`/api/health/foods/search?q=${encodeURIComponent(query)}`);
}

export async function getFoodDetails(fdcId) {
  return apiFetch(`/api/health/foods/${fdcId}`);
}

export async function getRecentFoods() {
  return apiFetch('/api/health/foods/recent');
}
