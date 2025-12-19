const serverless = require('serverless-http');
const app = require('../app');
const { connectToDatabase } = require('../lib/db');

// Ensure DB is connected before handling requests
let handler = serverless(app);

module.exports = async (req, res) => {
  try {
    // connect to DB if not connected (connectToDatabase is idempotent)
    await connectToDatabase();
  } catch (err) {
    console.error('Failed to connect to DB in serverless handler:', err.message);
    res.status(500).send({ error: 'DB connection failed' });
    return;
  }

  return handler(req, res);
};
