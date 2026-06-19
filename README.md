# SOC Triage — AI-Powered Alert Analysis

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-Sonnet_4.6-FF6B35?logo=anthropic&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

> **Cut through alert fatigue.** Paste any raw SIEM/EDR alert and get a structured triage report — severity classification, MITRE ATT&CK mapping, extracted IOCs, and an investigation checklist — in under 15 seconds.

**Live Demo:** https://soc-triage-client.vercel.app

---

## Why this exists

Enterprise SOCs handle **4,000–10,000 alerts per day** on average. Analysts spend up to 30 minutes on initial triage for a single alert — mapping to attack frameworks, extracting IOCs, writing up summaries for escalation. Most of that work is mechanical pattern recognition that AI can do instantly.

The open-source tooling gap is real: commercial SIEM platforms (Splunk, Microsoft Sentinel, CrowdStrike) have AI features locked behind expensive tiers. Free triage tools are either toy demos or require heavy infrastructure. SOC Triage fills the gap with a clean, deployable tool that any analyst can run.

---

## What it does

| Feature | Detail |
|---|---|
| **Severity classification** | CRITICAL / HIGH / MEDIUM / LOW / INFORMATIONAL with reasoning |
| **MITRE ATT&CK mapping** | Clickable technique badges linking to attack.mitre.org |
| **IOC extraction** | IPs, domains, file hashes, usernames, processes — all copyable |
| **Investigation checklist** | 5–8 prioritized, actionable steps per alert |
| **False positive assessment** | Likelihood rating with analyst notes |
| **History panel** | Last 10 analyses persisted in localStorage |
| **Export** | Download full report as JSON or copy as Markdown |
| **10 sample alerts** | Realistic pre-loaded scenarios to demo instantly |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│                                                     │
│  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │ History Panel│  │      Alert Input             │ │
│  │ (localStorage│  │  (paste / upload / sample)   │ │
│  └──────────────┘  └──────────────┬───────────────┘ │
│                                   │  POST /api/triage│
└───────────────────────────────────┼─────────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │      Express Server            │
                    │   server/routes/triage.js      │
                    └───────────────┬───────────────┘
                                    │  Anthropic SDK
                    ┌───────────────▼───────────────┐
                    │   Claude claude-sonnet-4-6     │
                    │  (structured JSON response)    │
                    └───────────────────────────────┘
```

**Client:** React + Vite + Tailwind CSS, deployed to Vercel  
**Server:** Node.js + Express, deployed to Railway  
**AI:** Anthropic Claude claude-sonnet-4-6 via official SDK

---

## Supported Alert Formats

SOC Triage handles any format a real SIEM would produce:

- **Syslog** (RFC 3164 / 5424)
- **Windows Event Log** (XML or plain text)
- **JSON** — EDR exports (CrowdStrike Falcon, Carbon Black, SentinelOne)
- **CEF / LEEF** — ArcSight, IBM QRadar
- **Plain text** — analyst-written summaries, copy-paste from dashboards
- **Mixed** — correlation alerts that combine multiple log formats

---

## MITRE ATT&CK Coverage

The AI maps alerts to techniques across all 14 ATT&CK tactics:

Reconnaissance · Resource Development · Initial Access · Execution · Persistence · Privilege Escalation · Defense Evasion · Credential Access · Discovery · Lateral Movement · Collection · Command and Control · Exfiltration · Impact

Each technique badge links directly to the corresponding attack.mitre.org page.

---

## Setup

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### Install & run locally

```bash
# Clone
git clone https://github.com/Sa10Lynx/soc-triage.git
cd soc-triage

# Install all dependencies (root + client + server)
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Configure environment
cp server/.env.example server/.env
# Edit server/.env and add your ANTHROPIC_API_KEY

cp client/.env.example client/.env
# client/.env already has the correct default (http://localhost:3001)

# Start both dev servers
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deployment

### Backend → Railway

1. Create a new Railway project, connect this repo
2. Set the root directory to `/server`
3. Add environment variable: `ANTHROPIC_API_KEY=sk-ant-...`
4. Add `CLIENT_ORIGIN=https://your-app.vercel.app`
5. Deploy — Railway auto-detects Node.js

### Frontend → Vercel

1. Import this repo on Vercel
2. Set root directory to `client`
3. Add environment variable: `VITE_API_URL=https://your-server.railway.app`
4. Deploy

---

## Screenshots

<img width="1907" height="868" alt="image" src="https://github.com/user-attachments/assets/bc8f18ab-bb50-4f3a-a1f8-0893c4e4c3cf" />
<img width="1591" height="731" alt="image" src="https://github.com/user-attachments/assets/7942f09a-c257-4f62-b7cf-3e25c4a1f1c4" />
<img width="1582" height="833" alt="image" src="https://github.com/user-attachments/assets/ed10898d-342b-468c-844d-600fc915e105" />


---

## Project Structure

```
soc-triage/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertInput.jsx   # Paste/upload/sample input panel
│   │   │   ├── TriageReport.jsx # Full report renderer
│   │   │   ├── HistoryPanel.jsx # localStorage history sidebar
│   │   │   ├── MitreTag.jsx     # ATT&CK technique badge
│   │   │   ├── SeverityBadge.jsx
│   │   │   └── sampleAlerts.js  # 10 realistic sample alerts
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
├── server/
│   ├── index.js                 # Express entry point
│   ├── routes/triage.js         # POST /api/triage
│   └── prompts/triagePrompt.js  # Claude system prompt
└── package.json                 # npm workspaces root
```

---

## License

MIT
