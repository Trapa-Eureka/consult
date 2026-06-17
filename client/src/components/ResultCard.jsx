const URGENCY_META = {
  routine: { tone: 'routine', icon: '●', text: 'Routine' },
  soon: { tone: 'soon', icon: '●', text: 'See soon' },
  urgent: { tone: 'urgent', icon: '▲', text: 'Urgent' },
  emergency: { tone: 'emergency', icon: '■', text: 'Emergency' },
};

export default function ResultCard({ result }) {
  const u = URGENCY_META[result.urgency] || URGENCY_META.routine;

  return (
    <div className="result">
      <div className={`urgency urgency--${u.tone}`}>
        <span className="urgency__dot">{u.icon}</span>
        <div>
          <span className="urgency__level">{u.text}</span>
          <span className="urgency__label">{result.urgencyLabel}</span>
        </div>
      </div>

      <div className="assessment">
        <span className="assessment__dept">{result.recommendedDepartment}</span>
        <p>{result.assessment}</p>
        {result.redFlags?.length > 0 && (
          <ul className="redflags">
            {result.redFlags.map((f, i) => (
              <li key={i}>⚠ {f}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="doctors">
        <h2>Recommended doctors · available times</h2>
        {result.doctors.length === 0 && (
          <p className="doctors__empty">No doctor found for this department.</p>
        )}
        {result.doctors.map((d) => (
          <div key={d.id} className="doctor">
            <div className="doctor__head">
              <div className="doctor__avatar">{d.name.replace('Dr. ', '').charAt(0)}</div>
              <div className="doctor__info">
                <span className="doctor__name">{d.name}</span>
                <span className="doctor__dept">{d.department}</span>
                <span className="doctor__spec">{d.specialties?.join(' · ')}</span>
              </div>
              <span className="doctor__lang">{d.languages?.join(', ')}</span>
            </div>
            <div className="slots">
              {d.suggestedSlots.length === 0 && (
                <span className="slots__empty">No available times</span>
              )}
              {d.suggestedSlots.map((s) => (
                <button key={s.iso} className="slot" title={`${s.date} ${s.time}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
