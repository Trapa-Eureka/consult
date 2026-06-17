import { useState } from 'react';
import { requestTriage } from './api.js';
import ResultCard from './components/ResultCard.jsx';

const EXAMPLES = [
  'Chest has felt tight for 3 days and I get short of breath climbing stairs',
  'My child has had a fever and a cough since yesterday',
  'I have hives on my face and it itches',
  "I haven't been sleeping well and feel anxious for a month",
];

export default function App() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(text) {
    const value = (text ?? symptoms).trim();
    if (value.length < 3) {
      setError('Please describe your symptoms in a bit more detail.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await requestTriage(value, 'en');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="widget">
        <header className="widget__header">
          <div className="brand">
            <span className="brand__mark">K</span>
            <div>
              <h1>Smart Triage</h1>
              <p>Describe your symptoms and get a department, urgency, and recommended doctors</p>
            </div>
          </div>
          <span className="ai-badge">AI Intake</span>
        </header>

        <div className="composer">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. Chest has felt tight for 3 days and I get short of breath"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
            }}
          />
          <div className="composer__row">
            <span className="hint">⌘/Ctrl + Enter to send</span>
            <button className="btn" disabled={loading} onClick={() => submit()}>
              {loading ? 'Analyzing…' : 'Get a recommendation'}
            </button>
          </div>
        </div>

        {!result && !loading && (
          <div className="examples">
            <span className="examples__label">Try describing it like this</span>
            <div className="examples__chips">
              {EXAMPLES.map((ex) => (
                <button key={ex} className="chip" onClick={() => { setSymptoms(ex); submit(ex); }}>
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <div className="alert">{error}</div>}

        {loading && (
          <div className="skeleton">
            <div className="skeleton__bar" />
            <div className="skeleton__bar skeleton__bar--short" />
          </div>
        )}

        {result && <ResultCard result={result} />}

        <footer className="widget__footer">
          This guidance is for reference only and does not replace medical diagnosis.
          {result?.source === 'mock' && <span className="footer-tag"> · Demo mode (rule-based)</span>}
        </footer>
      </div>
    </div>
  );
}
