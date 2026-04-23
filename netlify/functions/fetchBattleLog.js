const axios = require('axios');

exports.handler = async (event) => {
  const { tag } = event.queryStringParameters;
  const API_KEY = process.env.COC_API_KEY; 

  try {
    // RoyaleAPI Proxy for Battle Log
    const url = `https://cocproxy.royaleapi.dev/v1/players/%23${tag}/battlelog`;
    
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'application/json' }
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: { "Content-Type": "application/json" }
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Battle Log Fetch Failed" }) };
  }
};