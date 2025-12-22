const app = require("../app");
const { connectToDatabase } = require("../lib/db");

// Ensure DB connection (cached)
connectToDatabase();

module.exports = app;
