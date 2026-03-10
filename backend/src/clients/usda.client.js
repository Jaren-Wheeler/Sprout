const axios = require('axios');

if (!process.env.USDA_API_KEY) {
  throw new Error('USDA_API_KEY is missing from environment variables');
}

const usdaClient = axios.create({
  baseURL: 'https://api.nal.usda.gov/fdc/v1',
  params: {
    api_key: process.env.USDA_API_KEY,
  },
});

module.exports = usdaClient;
