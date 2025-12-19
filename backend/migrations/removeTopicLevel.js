const mongoose = require('mongoose');
require('dotenv').config();
const Topic = require('../models/Topic');

async function run(){
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dsa_sheet';
  await mongoose.connect(mongoUri);
  console.log('Connected to', mongoUri);
  try {
    const res = await Topic.updateMany({}, { $unset: { level: "" } });
    console.log('Migration result:', res);
  } catch (err){
    console.error('Migration error', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run().catch(err => { console.error(err); process.exit(1) });