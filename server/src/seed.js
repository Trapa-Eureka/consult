import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { Doctor } from './models/Doctor.js';
import { DOCTORS } from './data/doctors.js';

async function seed() {
  const ok = await connectDB(process.env.MONGODB_URI);
  if (!ok) {
    console.error('[seed] Could not connect to MongoDB — aborting seed.');
    process.exit(1);
  }

  await Doctor.deleteMany({});
  await Doctor.insertMany(DOCTORS);
  console.log(`[seed] Loaded ${DOCTORS.length} doctors`);

  await mongoose.disconnect();
  process.exit(0);
}

seed();
