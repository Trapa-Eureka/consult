import { Router } from 'express';
import { getDoctors, getDepartments } from '../repository.js';

export const doctorsRouter = Router();

doctorsRouter.get('/', async (_req, res) => {
  const doctors = await getDoctors();
  res.json({ departments: getDepartments(), doctors });
});
