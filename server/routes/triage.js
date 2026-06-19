import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { TRIAGE_SYSTEM_PROMPT } from '../prompts/triagePrompt.js';

const router = Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/', async (req, res) => {
  const { alertText } = req.body;

  if (!alertText || alertText.trim().length === 0) {
    return res.status(400).json({ error: 'alertText is required' });
  }

  if (alertText.length > 50000) {
    return res.status(400).json({ error: 'Alert text exceeds maximum length of 50,000 characters' });
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: TRIAGE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this security alert and return a triage report as JSON:\n\n${alertText}`,
        },
      ],
    });

    const rawContent = message.content[0].text.trim();

    let report;
    try {
      // Strip accidental markdown fences if Claude adds them despite instructions
      const cleaned = rawContent.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      report = JSON.parse(cleaned);
    } catch {
      return res.status(422).json({
        error: 'AI returned malformed JSON',
        raw: rawContent,
      });
    }

    return res.json({ report });
  } catch (err) {
    if (err.status === 429) {
      return res.status(429).json({ error: 'Rate limit reached. Please wait a moment before analyzing another alert.' });
    }
    if (err.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Check your ANTHROPIC_API_KEY.' });
    }
    console.error('Anthropic API error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});

export default router;
