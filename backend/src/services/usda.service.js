const prisma = require('../clients/prisma.client');
const usdaClient = require('../clients/usda.client');
const normalizeUsdaFood = require('../utils/normalizeUsdaFood');

/**
 * Search foods using USDA API
 */
async function searchFoods(query) {
  if (!query || !query.trim()) return [];

  try {
    const res = await usdaClient.get('/foods/search', {
      params: {
        query: query.trim(),
        pageSize: 25,
        dataType: ['Branded', 'Survey (FNDDS)', 'Foundation'],
      },
    });

    const foods = res.data.foods || [];

    return foods.map((food) => ({
      fdcId: food.fdcId,
      name: food.description,
      brandName: food.brandOwner || food.brandName || null,
    }));
  } catch (err) {
    console.error('USDA API failed:', err.response?.data || err.message);

    return [];
  }
}

/**
 * Get food details
 * Check cache
 * Fetch from USDA if missing
 * Save to cache
 */
async function getFoodDetails(fdcId) {
  fdcId = Number(fdcId);
  const cached = await prisma.foodCache.findUnique({
    where: { fdcId },
  });

  if (cached) {
    return cached;
  }

  const res = await usdaClient.get(`/food/${fdcId}`);

  const normalized = normalizeUsdaFood(res.data);

  await prisma.foodCache.create({
    data: normalized,
  });

  return normalized;
}

module.exports = {
  searchFoods,
  getFoodDetails,
};
