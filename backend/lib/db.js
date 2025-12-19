const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Reuse connection across serverless invocations using a global cache
const connection = {
  isConnected: false,
};

async function connectToDatabase() {
  if (connection.isConnected) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI || '';
  if (!mongoUri) {
    // fallback to in-memory for dev
    const memServer = await MongoMemoryServer.create();
    const memUri = memServer.getUri();
    await mongoose.connect(memUri);
    connection.isConnected = true;
    console.log('Connected to in-memory MongoDB at', memUri);
    return mongoose.connection;
  }

  // Use provided URI
  await mongoose.connect(mongoUri);
  connection.isConnected = true;
  console.log('Connected to MongoDB (using provided MONGO_URI)');
  return mongoose.connection;
}

module.exports = { connectToDatabase };
