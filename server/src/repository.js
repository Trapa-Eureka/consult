import { isConnected } from './db.js';
import { Doctor } from './models/Doctor.js';
import { TriageRequest } from './models/TriageRequest.js';
import { DOCTORS, DEPARTMENTS } from './data/doctors.js';

// Read from Mongo when connected, otherwise from the in-memory dummy data.

export async function getDoctors() {
  if (isConnected()) {
    const docs = await Doctor.find().lean();
    if (docs.length) return docs;
  }
  return DOCTORS;
}

export async function getDoctorsByDepartment(department) {
  const all = await getDoctors();
  return all.filter((d) => d.department === department);
}

export function getDepartments() {
  return DEPARTMENTS;
}

export async function logTriage(record) {
  if (!isConnected()) return; // skip logging in fallback mode
  try {
    await TriageRequest.create(record);
  } catch (err) {
    console.warn('[repo] failed to save triage log:', err.message);
  }
}
