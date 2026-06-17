import Anthropic from '@anthropic-ai/sdk';
import { getDoctors, getDepartments } from '../repository.js';
import { generateSlots } from './slots.js';

const MODEL = 'claude-opus-4-8';

const URGENCY_LEVELS = ['routine', 'soon', 'urgent', 'emergency'];

const URGENCY_LABEL = {
  en: {
    routine: 'Routine — book a standard appointment',
    soon: 'See a doctor soon — within a few days',
    urgent: 'Urgent — seek prompt care',
    emergency: 'Emergency — go to the ER / call emergency services now',
  },
};

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

// Build a compact catalog of departments/doctors to pass to the model.
function doctorCatalog(doctors) {
  return doctors.map((d) => ({
    id: d.id,
    name: d.name,
    department: d.department,
    specialties: d.specialties,
    languages: d.languages,
  }));
}

const triageSchema = {
  type: 'object',
  properties: {
    recommendedDepartment: { type: 'string' },
    urgency: { type: 'string', enum: URGENCY_LEVELS },
    assessment: { type: 'string', description: '1-2 sentence summary of the patient\'s concern (in the requested locale)' },
    redFlags: {
      type: 'array',
      items: { type: 'string' },
      description: 'Warning signs that need attention (empty array if none)',
    },
    recommendedDoctorIds: {
      type: 'array',
      items: { type: 'string' },
      description: '2-3 doctor ids from the recommended department',
    },
  },
  required: ['recommendedDepartment', 'urgency', 'assessment', 'redFlags', 'recommendedDoctorIds'],
  additionalProperties: false,
};

function buildSystemPrompt(departments) {
  return `You are an AI symptom-triage assistant for an outpatient clinic in the Philippines.
When a patient describes their symptoms in free text, you determine the most appropriate department and the urgency level.

Available departments (choose only from this list):
${departments.join(', ')}

Urgency criteria:
- routine: mild or chronic; a standard appointment is sufficient
- soon: should be seen within a few days
- urgent: needs prompt care (same day to next day)
- emergency: possible threat to life/organ; advise the ER immediately

Rules:
- recommendedDepartment must be one of the exact strings in the list above.
- recommendedDoctorIds must select 2-3 doctors from the provided list who belong to that department.
- Do not give a definitive diagnosis; focus on triage and guidance.
- Write the assessment and guidance text in the requested locale language.`;
}

// Call Claude — returns null on failure so we fall back to the mock.
async function classifyWithClaude({ symptoms, locale, doctors, departments }) {
  if (!client) return null;
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: triageSchema },
      },
      system: buildSystemPrompt(departments),
      messages: [
        {
          role: 'user',
          content: `locale: ${locale}

Patient symptoms:
"""${symptoms}"""

Available doctors (JSON):
${JSON.stringify(doctorCatalog(doctors))}`,
        },
      ],
    });

    const text = response.content.find((b) => b.type === 'text')?.text;
    if (!text) return null;
    const parsed = JSON.parse(text);
    return { ...parsed, source: 'claude' };
  } catch (err) {
    console.warn('[triage] Claude call failed, falling back to mock:', err.message);
    return null;
  }
}

// Rule-based mock triage — used when there's no API key or the call fails.
const KEYWORD_RULES = [
  { dept: 'Cardiology', urgency: 'urgent', kws: ['chest', 'heart', 'palpitation', 'short of breath', 'shortness of breath'] },
  { dept: 'Pediatrics', urgency: 'soon', kws: ['child', 'baby', 'kid', 'infant', 'toddler', 'my son', 'my daughter'] },
  { dept: 'OB-GYN', urgency: 'soon', kws: ['pregnan', 'menstru', 'period', 'gyne'] },
  { dept: 'Dermatology', urgency: 'routine', kws: ['rash', 'skin', 'acne', 'hives', 'itch'] },
  { dept: 'ENT', urgency: 'routine', kws: ['ear', 'nose', 'throat', 'sinus', 'sore throat'] },
  { dept: 'Orthopedics', urgency: 'soon', kws: ['joint', 'knee', 'back pain', 'bone', 'fracture', 'sprain'] },
  { dept: 'Ophthalmology', urgency: 'soon', kws: ['eye', 'vision', 'blurry'] },
  { dept: 'Psychiatry', urgency: 'soon', kws: ['anxiety', 'anxious', 'depress', 'stress', 'sleep', 'insomnia'] },
  { dept: 'Dental', urgency: 'routine', kws: ['tooth', 'teeth', 'dental', 'gum', 'cavity'] },
  { dept: 'Internal Medicine', urgency: 'soon', kws: ['fever', 'stomach', 'abdomen', 'diabet', 'blood pressure', 'nausea'] },
];

const EMERGENCY_KWS = ['unconscious', 'fainted', 'paralysis', 'seizure', 'severe bleeding', 'difficulty breathing', 'stroke', 'chest crushing'];

function classifyWithMock({ symptoms, doctors }) {
  const text = symptoms.toLowerCase();
  let match = KEYWORD_RULES.find((r) => r.kws.some((k) => text.includes(k.toLowerCase())));
  let urgency = match?.urgency ?? 'routine';
  const dept = match?.dept ?? 'Family Medicine';

  const redFlags = [];
  if (EMERGENCY_KWS.some((k) => text.includes(k.toLowerCase()))) {
    urgency = 'emergency';
    redFlags.push('Emergency warning sign detected');
  }

  const inDept = doctors.filter((d) => d.department === dept).slice(0, 3);
  return {
    recommendedDepartment: dept,
    urgency,
    assessment: 'This is a classification based on the symptoms you entered. An accurate diagnosis requires consulting a medical professional.',
    redFlags,
    recommendedDoctorIds: inDept.map((d) => d.id),
    source: 'mock',
  };
}

export async function runTriage({ symptoms, locale = 'en' }) {
  const doctors = await getDoctors();
  const departments = getDepartments();

  let result =
    (await classifyWithClaude({ symptoms, locale, doctors, departments })) ||
    classifyWithMock({ symptoms, doctors });

  // Validate the department — if the model returns something off-list, default to Family Medicine.
  if (!departments.includes(result.recommendedDepartment)) {
    result.recommendedDepartment = 'Family Medicine';
  }

  // Map recommended doctors: prefer the model's ids, then fill from the department.
  const byId = new Map(doctors.map((d) => [d.id, d]));
  let chosen = (result.recommendedDoctorIds || [])
    .map((id) => byId.get(id))
    .filter((d) => d && d.department === result.recommendedDepartment);

  if (chosen.length < 2) {
    const deptDoctors = doctors.filter((d) => d.department === result.recommendedDepartment);
    for (const d of deptDoctors) {
      if (chosen.length >= 3) break;
      if (!chosen.find((c) => c.id === d.id)) chosen.push(d);
    }
  }
  chosen = chosen.slice(0, 3);

  const lang = URGENCY_LABEL[locale] ? locale : 'en';

  return {
    recommendedDepartment: result.recommendedDepartment,
    urgency: result.urgency,
    urgencyLabel: URGENCY_LABEL[lang][result.urgency] || result.urgency,
    assessment: result.assessment,
    redFlags: result.redFlags || [],
    source: result.source,
    doctors: chosen.map((d) => ({
      id: d.id,
      name: d.name,
      department: d.department,
      specialties: d.specialties,
      languages: d.languages,
      suggestedSlots: generateSlots(d),
    })),
  };
}
