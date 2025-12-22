const app = require("../backend/app");
const { connectToDatabase } = require("../backend/lib/db");

connectToDatabase();
module.exports = app;
