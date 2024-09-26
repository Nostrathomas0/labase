const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

exports.handler = async (event) => {
  try {
    // Get the JWT secret from Secrets Manager
    const secretName = 'languFunct/secret/jwt';
    const secretData = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    const jwtSecret = secretData.SecretString;
    
    // Example: Decode JWT from headers
    const token = event.headers.Authorization.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);
    
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
