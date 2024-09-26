// index.js
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  try {
    // Example: Decode JWT from headers
    const token = event.headers.Authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Authorized', decoded }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized', error: error.message }),
    };
  }
};
