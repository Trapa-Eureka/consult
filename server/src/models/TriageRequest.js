import mongoose from 'mongoose';

// Triage request log — stored for operational analytics/audit.
const triageRequestSchema = new mongoose.Schema(
  {
    symptoms: { type: String, required: true },
    locale: { type: String, default: 'ko' },
    recommendedDepartment: String,
    urgency: String,
    redFlags: [String],
    recommendedDoctorIds: [String],
    source: String, // 'claude' | 'mock'
  },
  { timestamps: true }
);

export const TriageRequest = mongoose.model('TriageRequest', triageRequestSchema);
