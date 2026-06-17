import mongoose from 'mongoose';

let connected = false;

// Try to connect to MongoDB; on failure, return false so we use the in-memory fallback.
export async function connectDB(uri) {
  if (!uri) {
    console.warn('[db] MONGODB_URI not set — falling back to in-memory dummy data');
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    connected = true;
    console.log('[db] MongoDB connected');
    return true;
  } catch (err) {
    console.warn(`[db] MongoDB connection failed (${err.message}) — falling back to in-memory dummy data`);
    return false;
  }
}

export function isConnected() {
  return connected;
}
