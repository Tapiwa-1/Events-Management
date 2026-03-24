import { PackagePricing } from '../models/PackagePricing.js';

const numericFields = [
  'pa_under_100',
  'pa_under_200',
  'pa_under_350',
  'decor_20',
  'decor_30',
  'decor_40',
  'decor_50',
  'media_roora_still',
  'media_roora_reel',
  'catering_per_plate'
];

const sanitizePayload = (body = {}) => {
  const payload = {};

  for (const field of numericFields) {
    if (body[field] !== undefined) {
      const parsed = Number(body[field]);
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error(`Invalid value for ${field}`);
      }
      payload[field] = parsed;
    }
  }

  if (body.media_wedding_note !== undefined) {
    payload.media_wedding_note = String(body.media_wedding_note).trim() || 'Coming soon';
  }

  return payload;
};

export const getPublicPackages = async (req, res) => {
  try {
    const config = await PackagePricing.getConfig();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdminPackages = async (req, res) => {
  try {
    const config = await PackagePricing.getConfig();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePackages = async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);
    const updated = await PackagePricing.saveConfig(payload);
    res.json(updated);
  } catch (err) {
    const status = err.message.startsWith('Invalid value') ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};
