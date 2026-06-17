// Generate concrete appointment slots over the next few days from a doctor's weekly availability.
const DAY_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(n) {
  return String(n).padStart(2, '0');
}

export function generateSlots(doctor, { daysAhead = 10, maxSlots = 3 } = {}) {
  const result = [];
  const now = new Date();

  for (let offset = 0; offset <= daysAhead && result.length < maxSlots; offset++) {
    const date = new Date(now);
    date.setDate(now.getDate() + offset);
    const dow = date.getDay();
    if (!doctor.availableDays?.includes(dow)) continue;

    for (const time of doctor.slots || []) {
      if (result.length >= maxSlots) break;
      const [h, m] = time.split(':').map(Number);
      const slotDate = new Date(date);
      slotDate.setHours(h, m, 0, 0);
      if (slotDate <= now) continue; // skip times already past today

      result.push({
        iso: slotDate.toISOString(),
        date: `${slotDate.getFullYear()}-${pad(slotDate.getMonth() + 1)}-${pad(slotDate.getDate())}`,
        time,
        label: `${pad(slotDate.getMonth() + 1)}/${pad(slotDate.getDate())} (${DAY_LABEL[dow]}) ${time}`,
      });
    }
  }
  return result;
}
