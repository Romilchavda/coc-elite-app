const axios = require('axios');

exports.handler = async (event) => {
  const { tag } = event.queryStringParameters;
  const API_KEY = "YOUR_COC_API_KEY_HERE"; // Aapka CoC API Key

  try {
    const response = await axios.get(`https://api.clashofclans.com/v1/players/%23${tag}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};