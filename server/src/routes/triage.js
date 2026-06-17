import { Router } from 'express';
import { runTriage } from '../services/triage.js';
import { logTriage } from '../repository.js';

export const triageRouter = Router();

triageRouter.post('/', async (req, res) => {
  const { symptoms, locale } = req.body || {};

  if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length < 3) {
    return res.status(400).json({ error: 'Please enter at least 3 characters describing your symptoms.' });
  }

  try {
    const result = await runTriage({ symptoms: symptoms.trim(), locale });

    // Log for analytics/audit (only when a DB is connected)
    logTriage({
      symptoms: symptoms.trim(),
      locale: locale || 'en',
      recommendedDepartment: result.recommendedDepartment,
      urgency: result.urgency,
      redFlags: result.redFlags,
      recommendedDoctorIds: result.doctors.map((d) => d.id),
      source: result.source,
    });

    res.json(result);
  } catch (err) {
    console.error('[triage] processing error:', err);
    res.status(500).json({ error: 'An error occurred while processing the triage request.' });
  }
});
