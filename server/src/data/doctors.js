// Dummy doctor data — fictional roster in the style of eKonsulta Clinic's public listing.
// availableDays: 0=Sun ... 6=Sat / slots: available times (HH:mm) on those days
export const DEPARTMENTS = [
  'Family Medicine',
  'Internal Medicine',
  'Pediatrics',
  'OB-GYN',
  'Cardiology',
  'Dermatology',
  'ENT',
  'Orthopedics',
  'Ophthalmology',
  'Psychiatry',
  'General Surgery',
  'Dental',
];

export const DOCTORS = [
  {
    id: 'doc-fam-01', name: 'Dr. Andres Reyes', department: 'Family Medicine',
    specialties: ['General consultation', 'Health check-ups', 'Chronic disease management'],
    languages: ['Filipino', 'English'], availableDays: [1, 2, 3, 4, 5],
    slots: ['09:00', '09:30', '10:00', '14:00', '14:30'],
  },
  {
    id: 'doc-fam-02', name: 'Dr. Liza Mendoza', department: 'Family Medicine',
    specialties: ['Preventive medicine', 'Immunization', 'Whole-family care'],
    languages: ['Filipino', 'English'], availableDays: [1, 3, 5, 6],
    slots: ['08:30', '09:00', '11:00', '15:00'],
  },
  {
    id: 'doc-im-01', name: 'Dr. Ramon Cruz', department: 'Internal Medicine',
    specialties: ['Hypertension', 'Diabetes', 'General internal medicine'],
    languages: ['Filipino', 'English'], availableDays: [1, 2, 4, 5],
    slots: ['10:00', '10:30', '13:30', '14:00'],
  },
  {
    id: 'doc-im-02', name: 'Dr. Grace Villanueva', department: 'Internal Medicine',
    specialties: ['Gastroenterology', 'Thyroid', 'Infectious disease'],
    languages: ['Filipino', 'English'], availableDays: [2, 3, 4],
    slots: ['09:30', '11:00', '15:30', '16:00'],
  },
  {
    id: 'doc-ped-01', name: 'Dr. Patricia Lim', department: 'Pediatrics',
    specialties: ['Infant check-ups', 'Pediatric respiratory', 'Immunization'],
    languages: ['Filipino', 'English', 'Chinese'], availableDays: [1, 2, 3, 4, 5],
    slots: ['08:30', '09:00', '10:30', '13:00'],
  },
  {
    id: 'doc-ped-02', name: 'Dr. Marco Bautista', department: 'Pediatrics',
    specialties: ['Pediatric allergy', 'Growth & development', 'Newborn care'],
    languages: ['Filipino', 'English'], availableDays: [1, 3, 5],
    slots: ['11:00', '11:30', '14:00', '14:30'],
  },
  {
    id: 'doc-ob-01', name: 'Dr. Carmen dela Cruz', department: 'OB-GYN',
    specialties: ['Prenatal care', 'Gynecology', 'Women\'s health'],
    languages: ['Filipino', 'English'], availableDays: [2, 4, 6],
    slots: ['09:00', '10:00', '13:30', '15:00'],
  },
  {
    id: 'doc-card-01', name: 'Dr. Maria Santos', department: 'Cardiology',
    specialties: ['Coronary artery disease', 'Arrhythmia', 'Heart failure'],
    languages: ['Filipino', 'English'], availableDays: [1, 3, 5],
    slots: ['09:30', '10:00', '10:30', '14:00'],
  },
  {
    id: 'doc-card-02', name: 'Dr. Jose Aquino', department: 'Cardiology',
    specialties: ['Hypertension', 'Echocardiography', 'Preventive cardiology'],
    languages: ['Filipino', 'English'], availableDays: [2, 4],
    slots: ['08:30', '11:00', '13:00', '15:30'],
  },
  {
    id: 'doc-derm-01', name: 'Dr. Angela Tan', department: 'Dermatology',
    specialties: ['Skin disorders', 'Acne', 'Allergic skin conditions'],
    languages: ['Filipino', 'English'], availableDays: [1, 2, 4, 6],
    slots: ['10:00', '10:30', '14:30', '15:00'],
  },
  {
    id: 'doc-ent-01', name: 'Dr. Daniel Garcia', department: 'ENT',
    specialties: ['Ear, nose & throat', 'Sinusitis', 'Hearing'],
    languages: ['Filipino', 'English'], availableDays: [1, 3, 5],
    slots: ['09:00', '09:30', '13:00', '13:30'],
  },
  {
    id: 'doc-ortho-01', name: 'Dr. Victor Ramos', department: 'Orthopedics',
    specialties: ['Joints', 'Spine', 'Sports injuries'],
    languages: ['Filipino', 'English'], availableDays: [2, 4, 6],
    slots: ['10:30', '11:00', '14:00', '14:30'],
  },
  {
    id: 'doc-opht-01', name: 'Dr. Sofia Navarro', department: 'Ophthalmology',
    specialties: ['Vision correction', 'Conjunctivitis', 'Cataract'],
    languages: ['Filipino', 'English'], availableDays: [1, 3, 5],
    slots: ['09:00', '10:00', '13:30', '15:00'],
  },
  {
    id: 'doc-psy-01', name: 'Dr. Elena Domingo', department: 'Psychiatry',
    specialties: ['Anxiety', 'Depression', 'Stress management'],
    languages: ['Filipino', 'English'], availableDays: [2, 4],
    slots: ['11:00', '13:00', '14:00', '16:00'],
  },
  {
    id: 'doc-surg-01', name: 'Dr. Paolo Castillo', department: 'General Surgery',
    specialties: ['General surgery', 'Gallbladder', 'Hernia'],
    languages: ['Filipino', 'English'], availableDays: [1, 4],
    slots: ['08:30', '09:00', '13:00'],
  },
  {
    id: 'doc-dent-01', name: 'Dr. Bianca Flores', department: 'Dental',
    specialties: ['Cavities', 'Scaling', 'Oral check-ups'],
    languages: ['Filipino', 'English'], availableDays: [1, 2, 3, 5],
    slots: ['09:00', '10:00', '11:00', '14:00'],
  },
];
