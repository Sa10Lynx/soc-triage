import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import triageRouter from './routes/triage.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/triage', triageRouter);

app.listen(PORT, () => {
  console.log(`SOC Triage server running on port ${PORT}`);
});
