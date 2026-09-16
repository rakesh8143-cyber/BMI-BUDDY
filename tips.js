// /api/tips.js
// A Vercel serverless function. Runs on the server, never in the browser,
// so the GEMINI_API_KEY environment variable stays hidden from visitors.
//
// Setup:
// 1. Get a free key from https://aistudio.google.com/apikey
// 2. In your Vercel project: Settings -> Environment Variables
//    add GEMINI_API_KEY = <your key>, then redeploy.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Add it in Vercel project settings.' });
    return;
  }

  const { bmi, cat, age, sex } = req.body || {};
  if (typeof bmi !== 'number' || !cat || !age || (sex !== 0 && sex !== 1)) {
    res.status(400).json({ error: 'Missing or invalid bmi, cat, age, or sex.' });
    return;
  }

  const prompt = `A user of a BMI calculator app has these results: BMI ${bmi.toFixed(1)} (category: ${cat}), age ${age}, sex ${sex ? 'male' : 'female'}.
Write 3-4 short, practical, encouraging general health tips relevant to this category (nutrition, activity, or lifestyle). Keep it general wellness advice, not a medical diagnosis or prescription. Do not repeat the BMI number back. Plain text, one tip per line, no markdown headers.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: 'Upstream AI error', detail: errText });
      return;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      res.status(502).json({ error: 'No text returned from AI' });
      return;
    }

    res.status(200).json({ text: text.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', detail: String(err) });
  }
}
