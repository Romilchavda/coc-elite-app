const axios = require('axios');

exports.handler = async (event) => {
  const { tag } = event.queryStringParameters;
  const API_KEY = process.env.COC_API_KEY; 

  try {
    // Proxy URL use kar rahe hain jo IP restriction bypass kar deta hai
    const url = `https://cocproxy.royaleapi.dev/v1/players/%23${tag}`;
    
    const response = await axios.get(url, {
      headers: { 
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // CORS handle karne ke liye
      }
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Proxy Fetch Failed", message: error.message }) 
    };
  }
};