import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

const bereichOptions = [
  '1.01 BMW Empfang',
  '1.02 BMW Fahrzeugpräsentation',
  '1.03 BMW Kundenberatung 1',
  '1.03 BMW Kundenberatung 2',
  '1.04 BMW Verkaufslounge 1',
  '1.04 BMW Verkaufslounge 2',
  '1.04 BMW Verkaufslounge 3',
  '1.04 BMW Verkaufslounge 4',
  '1.04 BMW Verkaufslounge 5',
  '1.04 BMW Verkaufslounge 6',
  '1.05 BMW Customer Hospitality Area',
  '1.05 BMW Kundenlounge',
  '1.06 BMW Customer Interaction Lounge',
  '1.07 BMW Bar',
  '1.08 BMW Fahrzeugübergabe',
  '1.08 BMW Multifunctional Handover Bay',
  '1.09 BMW Service Beratungslounge',
  '1.09 BMW Service Beratungslounge 2',
  '1.09 BMW Service Beratungslounge 3',
  '1.09 BMW Service Beratungslounge 4',
  '1.10 BMW Multifunktionaltheke',
  '1.11 BMW Shop',
  '1.12 BMW Anproberaum',
  '1.12 BMW Fitting room',
  '1.13 BMW Teilevertrieb',
  '1.14 BMW Aftersales',
  '1.15 BMW Cafe',
  '1.15 BMW Cafeteria',
  '1.30 BMW General',
  '2.1 BMW M',
  '2.2 BMW GKL Bereich',
  '2.2 BMW GKL Zone',
  '3.1 BPS Verkaufslounge',
  '4.01 MINI Empfang',
  '4.02 MINI Highlight Car',
  '4.03 MINI Verkaufsberatung 1',
  '4.03 MINI Verkaufsberatung 2',
  '4.03 MINI Verkaufsberatung 3',
  '4.04 MINI Verkaufslounge',
  '4.06 MINI Service Beratungslounge',
  '4.07 MINI JCW',
  '4.08 MINI Fahrzeugpräsentation',
  '4.30 MINI General',
];

const vorhangOptions = [
  'BMWC1101348 Vorhang SATO',
  'Vorhang Spaghetti grau',
  'Vorhang Spaghetti schwarz',
  'MINC1101757 Vorhang CAMEE JA 6007 Farbe 051 blau',
  'MINC1101755 Vorhang CAMEE JA 6007 Farbe 011 bordeaux',
  'MINC1101754 Vorhang CAMEE JA6007 Farbe 060 gold braun',
  'MINC1101750 Vorhang CAMEE JA 6007 Farbe 061 rost',
  'MINC1101749 Vorhang CAMEE JA 6007 Farbe 030 grün',
  'MINC1101752 Vorhang CAMEE JA 6007 Farbe 040 weiß gold',
  'MINC1101756 Vorhang ANTONY JA6005 Farbe 010 rot',
  'MINC1101762 Vorhang ANTONY JA 6005 Farbe 052 blau',
  'MINC1103195 Vorhang ANTONY JA 6005 Farbe 035 grün',
  'MINC1101767 Vorhang ANTONY JA 6005 Farbe 093 grau',
  'MINC1101760 Vorhang ANTONY JA 6005 Farbe 020 braun',
  'MINC1101765 Vorhang ANTONY JA 6005 Farbe 080 türkis',
  'MINC1101759 Vorhang ANTONY JA 6005 Farbe 040 gelb',
];

const vorhangschieneOptions = ['Gerade', 'L-Forme', 'U-Forme', 'Sonder'];
const befestigungOptions = [
  'Deckenträger',
  'Deckenabhangträger <150cm',
  'Deckenabhangträger >150cm',
  'Wandhalterung / Lager',
  'Sonder',
  'Lösungsvorschlag',
  'Kombinierter Befestigungstyp (Bitte im Kommentar präzisieren)',
];
const fotoOptions = Array.from({ length: 20 }, (_, i) => `Foto ${i + 1}`);

const emptyDraft = {
  bereich: '',
  vorhang: '',
  lichteDeckenhoehe: '',
  oberkanteVorhangschiene: '',
  hoehe: '',
  breite: '',
  stueckzahl: '1',
  vorhangschiene: '',
  vorhangschieneB: '',
  befestigungstypSchiene: '',
  foto: '',
  kommentar: '',
};

const steps = [
  {
    key: 'bereich',
    label: 'Bereich',
    description: 'Wähle den Bereich aus der Projektliste.',
    type: 'select',
    options: bereichOptions,
    required: true,
  },
  {
    key: 'vorhang',
    label: 'Vorhang / Referenznummer',
    description: 'Wähle den passenden Vorhang oder die Referenznummer.',
    type: 'select',
    options: vorhangOptions,
    required: true,
  },
  {
    key: 'lichteDeckenhoehe',
    label: 'Lichte Deckenhöhe',
    description: 'Optionales Maß in Millimetern.',
    type: 'number',
  },
  {
    key: 'oberkanteVorhangschiene',
    label: 'Oberkante Vorhangschiene',
    description: 'Optionales Maß in Millimetern.',
    type: 'number',
  },
  {
    key: 'hoehe',
    label: 'H - Höhe (mm)',
    description: 'Endmaß für die Vorhanghöhe.',
    type: 'number',
    required: true,
  },
  {
    key: 'breite',
    label: 'B - Breite (mm)',
    description: 'Endmaß für die Vorhangbreite.',
    type: 'number',
    required: true,
  },
  {
    key: 'stueckzahl',
    label: 'Stückzahl',
    description: 'Wie viele Stück werden benötigt?',
    type: 'number',
    required: true,
  },
  {
    key: 'vorhangschiene',
    label: 'Vorhangschiene',
    description: 'Wähle die Form der Schiene.',
    type: 'select',
    options: vorhangschieneOptions,
  },
  {
    key: 'vorhangschieneB',
    label: 'Vorhangschiene B (mm)',
    description: 'Breite / Länge der Schiene.',
    type: 'number',
  },
  {
    key: 'befestigungstypSchiene',
    label: 'Befestigungstyp Schiene',
    description: 'Wähle die passende Befestigung.',
    type: 'select',
    options: befestigungOptions,
  },
  {
    key: 'foto',
    label: 'Foto',
    description: 'Verknüpfe den Eintrag mit einem Foto.',
    type: 'select',
    options: fotoOptions,
  },
  {
    key: 'kommentar',
    label: 'Kommentar',
    description: 'Zusätzliche Hinweise für Bestellung oder Montage.',
    type: 'textarea',
  },
];

function fieldIsValid(step, draft) {
  if (!step.required) return true;
  return String(draft[step.key] ?? '').trim() !== '';
}

function WizardField({ step, value, onChange }) {
  if (step.type === 'select') {
    return (
      <select className="wizard-input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Bitte auswählen</option>
        {step.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (step.type === 'textarea') {
    return (
      <textarea
        className="wizard-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Kommentar hinzufügen"
      />
    );
  }

  return (
    <input
      className="wizard-input"
      type={step.type === 'number' ? 'number' : 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={step.type === 'number' ? 'Bitte Zahl eingeben' : 'Hier eingeben'}
    />
  );
}

export default function App() {
  const [draft, setDraft] = useState(emptyDraft);
  const [items, setItems] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const currentStep = useMemo(() => steps[stepIndex], [stepIndex]);
  const progress = Math.round(((showReview ? steps.length + 1 : stepIndex + 1) / (steps.length + 1)) * 100);

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (!fieldIsValid(currentStep, draft)) return;
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setShowReview(true);
    }
  };

  const prevStep = () => {
    if (showReview) {
      setShowReview(false);
      return;
    }
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  const addItem = () => {
    setItems((prev) => [...prev, { ...draft, id: Date.now(), nummer: prev.length + 1 }]);
    setDraft(emptyDraft);
    setStepIndex(0);
    setShowReview(false);
    setTimeout(() => {
      document.querySelector('.table-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id).map((item, idx) => ({ ...item, nummer: idx + 1 })));
  };

  const exportExcel = () => {
    if (items.length === 0) {
      alert('Bitte zuerst mindestens einen Eintrag hinzufügen.');
      return;
    }

    const data = items.map((item) => ({
      Bereich: item.bereich,
      'Vorhang / Referenznummer': item.vorhang,
      'Lichte Deckenhöhe': item.lichteDeckenhoehe,
      'Oberkante Vorhangschiene': item.oberkanteVorhangschiene,
      'H - Höhe (mm)': item.hoehe,
      'B - Breite (mm)': item.breite,
      Stückzahl: item.stueckzahl,
      Vorhangschiene: item.vorhangschiene,
      'Vorhangschiene B (mm)': item.vorhangschieneB,
      'Befestigungstyp Schiene': item.befestigungstypSchiene,
      Foto: item.foto,
      Kommentar: item.kommentar,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [
      { wch: 34 },
      { wch: 52 },
      { wch: 18 },
      { wch: 24 },
      { wch: 16 },
      { wch: 16 },
      { wch: 12 },
      { wch: 18 },
      { wch: 20 },
      { wch: 32 },
      { wch: 12 },
      { wch: 28 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vorhänge');
    XLSX.writeFile(wb, 'vorhaenge_bestellformular.xlsx');
  };

  return (
    <>
      <style>{`
        :root {
          color-scheme: light;
          font-family: Inter, Arial, sans-serif;
          color: #0f172a;
          background: #f6f7fb;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background:
            radial-gradient(circle at top left, rgba(99,102,241,0.10), transparent 24%),
            radial-gradient(circle at top right, rgba(14,165,233,0.09), transparent 22%),
            linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
        }
        #root { min-height: 100vh; }
        .page {
          max-width: 1320px;
          margin: 0 auto;
          padding: 28px 20px 40px;
        }
        .hero, .panel {
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(148,163,184,0.18);
          box-shadow: 0 20px 60px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.8);
          backdrop-filter: blur(12px);
          border-radius: 28px;
        }
        .hero {
          padding: 28px 30px;
          margin-bottom: 22px;
        }
        .hero-top {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 12px;
        }
        .logo-wrap {
          width: 132px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(148,163,184,0.16);
          overflow: hidden;
          flex-shrink: 0;
        }
        .logo-wrap img {
          max-width: 110px;
          max-height: 40px;
          object-fit: contain;
        }
        .badge {
          display: inline-flex;
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .08em;
          background: rgba(79,70,229,0.08);
          color: #4f46e5;
          border: 1px solid rgba(99,102,241,0.16);
          font-weight: 700;
        }
        .hero h1 {
          margin: 8px 0 6px;
          font-size: 44px;
          line-height: 1.02;
          letter-spacing: -0.03em;
        }
        .hero p {
          margin: 0;
          max-width: 820px;
          color: #475569;
          font-size: 16px;
          line-height: 1.65;
        }
        .stack-layout {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .panel { padding: 24px; }
        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }
        .panel-head h2 {
          margin: 0;
          font-size: 30px;
          letter-spacing: -0.03em;
        }
        .counter {
          padding: 10px 14px;
          border-radius: 999px;
          font-size: 14px;
          color: #7c3aed;
          background: rgba(124,58,237,0.08);
          border: 1px solid rgba(167,139,250,0.18);
          font-weight: 700;
        }
        .progress-box { margin-bottom: 22px; }
        .progress-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
        }
        .progress-bar {
          height: 10px;
          border-radius: 999px;
          background: #e2e8f0;
          overflow: hidden;
        }
        .progress-value {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #8b5cf6, #3b82f6);
          transition: width .25s ease;
        }
        .step-card {
          min-height: 340px;
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(255,255,255,0.86), rgba(248,250,252,0.9));
          border: 1px solid rgba(148,163,184,0.14);
          padding: 22px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .step-kicker {
          color: #6366f1;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 10px;
        }
        .step-card h3 {
          margin: 0 0 8px;
          font-size: 28px;
          letter-spacing: -0.03em;
        }
        .step-card p {
          margin: 0 0 20px;
          color: #64748b;
          line-height: 1.6;
          max-width: 800px;
        }
        .wizard-label {
          display: block;
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 700;
          color: #334155;
        }
        .wizard-input, .wizard-textarea {
          width: 100%;
          border-radius: 18px;
          border: 1px solid rgba(148,163,184,0.22);
          background: #fff;
          color: #0f172a;
          outline: none;
          transition: .18s ease;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .wizard-input {
          height: 58px;
          padding: 0 16px;
          font-size: 16px;
        }
        .wizard-textarea {
          min-height: 150px;
          padding: 14px 16px;
          font-size: 15px;
          resize: vertical;
        }
        .wizard-input:focus, .wizard-textarea:focus {
          border-color: rgba(59,130,246,0.52);
          box-shadow: 0 0 0 4px rgba(59,130,246,0.10);
        }
        .error-text {
          margin-top: 10px;
          color: #dc2626;
          font-size: 13px;
          font-weight: 600;
        }
        .wizard-actions {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 18px;
        }
        .btn {
          border: 0;
          cursor: pointer;
          border-radius: 16px;
          transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease;
          font-weight: 800;
        }
        .btn:hover { transform: translateY(-1px); }
        .btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }
        .btn-secondary {
          height: 50px;
          padding: 0 18px;
          background: #fff;
          color: #334155;
          border: 1px solid rgba(148,163,184,0.24);
        }
        .btn-primary {
          height: 50px;
          padding: 0 18px;
          color: white;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          box-shadow: 0 14px 30px rgba(99,102,241,0.18);
        }
        .review-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 4px;
        }
        .review-item {
          background: #fff;
          border: 1px solid rgba(148,163,184,0.14);
          border-radius: 18px;
          padding: 14px;
        }
        .review-item small {
          display: block;
          color: #64748b;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .08em;
          font-weight: 800;
          margin-bottom: 6px;
        }
        .review-item div {
          color: #0f172a;
          font-size: 14px;
          line-height: 1.5;
          word-break: break-word;
        }
        .table-top-actions {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 14px;
        }
        .table-wrap {
          overflow: auto;
          border-radius: 22px;
          border: 1px solid rgba(148,163,184,0.14);
          background: rgba(255,255,255,0.78);
        }
        table {
          width: 100%;
          min-width: 1560px;
          border-collapse: collapse;
        }
        thead th {
          text-align: left;
          padding: 15px 14px;
          background: #f8fafc;
          color: #475569;
          font-size: 13px;
          border-bottom: 1px solid rgba(148,163,184,0.16);
          white-space: nowrap;
        }
        tbody td {
          padding: 14px;
          border-bottom: 1px solid rgba(148,163,184,0.10);
          font-size: 14px;
          color: #0f172a;
          vertical-align: top;
        }
        tbody tr:hover { background: rgba(99,102,241,0.03); }
        .empty {
          min-height: 360px;
          border: 1px dashed rgba(148,163,184,0.20);
          border-radius: 24px;
          display: grid;
          place-items: center;
          padding: 26px;
          text-align: center;
          background: linear-gradient(180deg, #fafbff, #f8fafc);
        }
        .empty-icon {
          width: 82px;
          height: 82px;
          border-radius: 26px;
          display: grid;
          place-items: center;
          margin: 0 auto 14px;
          font-size: 28px;
          color: #6d28d9;
          background: rgba(124,58,237,0.10);
          border: 1px solid rgba(167,139,250,0.18);
        }
        .empty h3 {
          margin: 0 0 8px;
          font-size: 20px;
        }
        .empty p {
          margin: 0;
          color: #64748b;
          line-height: 1.6;
          max-width: 460px;
        }
        .delete-btn {
          height: 34px;
          padding: 0 12px;
          border-radius: 10px;
          background: rgba(239,68,68,0.08);
          color: #b91c1c;
          border: 1px solid rgba(239,68,68,0.14);
          font-weight: 800;
          cursor: pointer;
        }
        @media (max-width: 900px) {
          .hero h1 { font-size: 36px; }
          .review-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 720px) {
          .page { padding: 14px 12px 24px; }
          .hero, .panel { border-radius: 22px; padding: 18px; }
          .panel-head { flex-direction: column; align-items: flex-start; }
          .hero-top { flex-direction: column; align-items: flex-start; }
          .hero h1 { font-size: 30px; }
          .review-grid { grid-template-columns: 1fr; }
          .wizard-actions { flex-direction: column; }
          .btn-primary, .btn-secondary { width: 100%; }
        }
      `}</style>

      <div className="page">
        <section className="hero">
          <div className="hero-top">
            <div className="logo-wrap">
              <img src="/logo.png" alt="Logo" />
            </div>
            <div className="badge">12-Step Wizard</div>
          </div>
          <h1>Vorhang Formular</h1>
          <p>
            
          </p>
        </section>

        <div className="stack-layout">
          <section className="panel">
            <div className="panel-head">
              <h2>Neue Position</h2>
              <div className="counter">{items.length} Einträge</div>
            </div>

            <div className="progress-box">
              <div className="progress-meta">
                <span>{showReview ? 'Prüfung' : `Schritt ${stepIndex + 1} von ${steps.length}`}</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-value" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {!showReview ? (
              <div className="step-card">
                <div className="step-kicker">Aufmaß-Assistent</div>
                <h3>{currentStep.label}</h3>
                <p>{currentStep.description}</p>

                <label className="wizard-label">{currentStep.label}</label>
                <WizardField
                  step={currentStep}
                  value={draft[currentStep.key]}
                  onChange={(value) => updateField(currentStep.key, value)}
                />

                {currentStep.required && !fieldIsValid(currentStep, draft) && (
                  <div className="error-text">Dieses Feld ist erforderlich.</div>
                )}

                <div className="wizard-actions">
                  <button className="btn btn-secondary" onClick={prevStep} disabled={stepIndex === 0}>
                    Zurück
                  </button>
                  <button className="btn btn-primary" onClick={nextStep}>
                    {stepIndex === steps.length - 1 ? 'Zur Prüfung' : 'Weiter'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="step-card">
                <div className="step-kicker">Letzter Schritt</div>
                <h3>Zusammenfassung</h3>
                <p>Проверь данные этой шторы. Если всё хорошо, добавь запись в общую таблицу.</p>

                <div className="review-grid">
                  {steps.map((step) => (
                    <div className="review-item" key={step.key}>
                      <small>{step.label}</small>
                      <div>{draft[step.key] || '—'}</div>
                    </div>
                  ))}
                </div>

                <div className="wizard-actions">
                  <button className="btn btn-secondary" onClick={prevStep}>Zurück</button>
                  <button className="btn btn-primary" onClick={addItem}>In Tabelle übernehmen</button>
                </div>
              </div>
            )}
          </section>

          <section className="panel table-section">
            <div className="panel-head">
              <h2>Bestelltabelle</h2>
              <div className="counter">Excel bereit</div>
            </div>

            <div className="table-top-actions">
              <button className="btn btn-secondary" onClick={exportExcel}>Excel herunterladen</button>
            </div>

            {items.length === 0 ? (
              <div className="empty">
                <div>
                  <div className="empty-icon">⌁</div>
                  <h3>Noch keine Einträge vorhanden.</h3>
                  <p>Fülle oben den 12-Schritte-Wizard aus und übernimm die erste Position in die Tabelle.</p>
                </div>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Bereich</th>
                      <th>Vorhang / Referenznummer</th>
                      <th>Lichte Deckenhöhe</th>
                      <th>Oberkante Vorhangschiene</th>
                      <th>H</th>
                      <th>B</th>
                      <th>Stück</th>
                      <th>Schiene</th>
                      <th>Schiene B</th>
                      <th>Befestigung</th>
                      <th>Foto</th>
                      <th>Kommentar</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.nummer}</td>
                        <td>{item.bereich || '—'}</td>
                        <td>{item.vorhang || '—'}</td>
                        <td>{item.lichteDeckenhoehe || '—'}</td>
                        <td>{item.oberkanteVorhangschiene || '—'}</td>
                        <td>{item.hoehe || '—'}</td>
                        <td>{item.breite || '—'}</td>
                        <td>{item.stueckzahl || '—'}</td>
                        <td>{item.vorhangschiene || '—'}</td>
                        <td>{item.vorhangschieneB || '—'}</td>
                        <td>{item.befestigungstypSchiene || '—'}</td>
                        <td>{item.foto || '—'}</td>
                        <td>{item.kommentar || '—'}</td>
                        <td>
                          <button className="delete-btn" onClick={() => removeItem(item.id)}>Löschen</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
