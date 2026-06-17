import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import { triageRouter } from './routes/triage.js';
import { doctorsRouter } from './routes/doctors.js';

const PORT = process.env.PORT || 4000;

async function main() {
  await connectDB(process.env.MONGODB_URI);

  const app = express();
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      ai: process.env.ANTHROPIC_API_KEY ? 'claude' : 'mock',
    });
  });

  app.use('/api/triage', triageRouter);
  app.use('/api/doctors', doctorsRouter);

  app.listen(PORT, () => {
    console.log(`[server] http://localhost:${PORT}`);
    console.log(`[server] AI mode: ${process.env.ANTHROPIC_API_KEY ? 'Claude' : 'Mock (rule-based)'}`);
  });
}

main();
