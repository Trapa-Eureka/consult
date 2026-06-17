import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    department: { type: String, required: true, index: true },
    specialties: [String],
    languages: [String],
    availableDays: [Number], // 0=Sun ... 6=Sat
    slots: [String], // 'HH:mm'
  },
  { timestamps: true }
);

export const Doctor = mongoose.model('Doctor', doctorSchema);
