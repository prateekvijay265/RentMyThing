const express = require('express');
const router = express.Router();
const { db } = require('../db');

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });
    if (!response.ok) return null;
    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return textContent ? JSON.parse(textContent) : null;
  } catch (err) {
    console.error('Gemini API Error:', err);
    return null;
  }
}

router.post('/analyze-listing', async (req, res) => {
  const { title, description, category, rentPricePerDay } = req.body;

  const geminiResult = await callGemini(`
    Analyze this peer rental listing for fraud risk on an Indian campus marketplace (IIT/BITS/IIM).
    Title: "${title}", Category: "${category}", Price: ₹${rentPricePerDay}/day, Desc: "${description}"
    Return JSON format: {"riskScore": number 0-10, "reasons": string[], "recommendations": string[]}
  `);

  if (geminiResult && geminiResult.riskScore !== undefined) {
    return res.json(geminiResult);
  }

  const price = Number(rentPricePerDay);
  let riskScore = 1;
  const reasons = [];
  if (price < 40 && category === 'Camera') {
    riskScore = 8;
    reasons.push('Price (under ₹50/day) is over 85% below Indian market benchmark for professional DSLR/4K Camera equipment.');
  } else if (price < 80 && category === 'Laptop') {
    riskScore = 8;
    reasons.push('Laptop listing daily rate is suspiciously below normal campus rental rates (₹300-₹900/day).');
  }

  res.json({
    riskScore,
    reasons,
    recommendations: riskScore > 4 ? ['Request live verification photo in peer chat before payment.'] : ['Safe Listing. Pricing aligns with Indian campus peer market standards.']
  });
});

router.get('/recommendations', (req, res) => {
  const { type = 'forYou' } = req.query;
  if (type === 'trending') {
    return res.json(db.products.slice(0, 4));
  }
  res.json(db.products.slice(0, 6));
});

router.post('/parse-search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.json({ category: 'All', keyword: '' });

  const geminiResult = await callGemini(`
    Parse this natural language campus rental search: "${query}".
    Available categories: Electronics, Laptop, Camera, Cycle, Gaming, Projector, Sports, Musical Instruments, Books, Kitchen Items, Hostel Essentials, Tools, Fashion.
    Return JSON format: {"category": string or null, "keyword": string, "radius": number or null}
  `);

  if (geminiResult) {
    return res.json(geminiResult);
  }

  const q = query.toLowerCase();
  let category = null;
  if (q.includes('laptop') || q.includes('macbook')) category = 'Laptop';
  else if (q.includes('camera') || q.includes('dslr')) category = 'Camera';
  else if (q.includes('cycle') || q.includes('bike')) category = 'Cycle';
  else if (q.includes('ps5') || q.includes('game')) category = 'Gaming';
  else if (q.includes('projector')) category = 'Projector';

  res.json({
    category,
    keyword: query,
    radius: q.includes('nearby') || q.includes('within') ? 50 : null
  });
});

router.get('/bundles', (req, res) => {
  res.json(db.bundles);
});

module.exports = router;
