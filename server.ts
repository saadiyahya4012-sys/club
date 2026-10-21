import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { GOOGLE_SCRIPT_URL } from './src/config.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial config defaults
const DEFAULT_CONFIG = {
  adminEmail: process.env.ADMIN_EMAIL || 'saadiyahya4012@gmail.com',
  googleAppsScriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL || GOOGLE_SCRIPT_URL || '',
  allowRegistrations: true,
};

function readConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const loaded = JSON.parse(content);
      return { 
        ...DEFAULT_CONFIG, 
        ...loaded, 
        googleAppsScriptUrl: loaded.googleAppsScriptUrl || GOOGLE_SCRIPT_URL || '' 
      };
    }
  } catch (e) {
    console.error('Error reading config file:', e);
  }
  return { ...DEFAULT_CONFIG, googleAppsScriptUrl: GOOGLE_SCRIPT_URL || DEFAULT_CONFIG.googleAppsScriptUrl };
}

function writeConfig(newConfig: any) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing config file:', e);
  }
}

function readRegistrations(): any[] {
  try {
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const content = fs.readFileSync(REGISTRATIONS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading registrations file:', e);
  }
  return [];
}

function writeRegistrations(data: any[]) {
  try {
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing registrations file:', e);
  }
}

app.use(express.json());

// API: Get current config
app.get('/api/config', (_req, res) => {
  const config = readConfig();
  res.json({
    adminEmail: config.adminEmail,
    googleAppsScriptUrl: config.googleAppsScriptUrl,
    allowRegistrations: config.allowRegistrations,
  });
});

// API: Update config
app.post('/api/config', (req, res) => {
  const { adminEmail, googleAppsScriptUrl, allowRegistrations } = req.body;
  const current = readConfig();
  const updated = {
    ...current,
    adminEmail: typeof adminEmail === 'string' ? adminEmail.trim() : current.adminEmail,
    googleAppsScriptUrl: typeof googleAppsScriptUrl === 'string' ? googleAppsScriptUrl.trim() : current.googleAppsScriptUrl,
    allowRegistrations: typeof allowRegistrations === 'boolean' ? allowRegistrations : current.allowRegistrations,
  };
  writeConfig(updated);
  res.json({ success: true, config: updated });
});

// API: Test Google Apps Script Web App URL
app.post('/api/test-sheets', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !url.startsWith('https://script.google.com')) {
    return res.status(400).json({ success: false, error: 'URL Google Apps Script invalide. Elle doit commencer par https://script.google.com' });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Ping - Club Informatique',
        email: 'ping-test@club-informatique.edu',
        phone: '+00 000 000 000',
        fieldOfStudy: 'Génie Informatique',
        studyLevel: 'Licence 3',
        interests: ['Web Development', 'Intelligence Artificielle'],
        motivation: 'Test de connectivité automatique depuis le panneau d’administration.',
        isTest: true,
      }),
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return res.json({ success: true, message: 'Connexion avec Google Apps Script réussie !', data });
    } else {
      return res.status(502).json({ success: false, error: `Google Apps Script a répondu avec le statut ${response.status}` });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: `Impossible de joindre le Web App Google Apps Script : ${err.message}` });
  }
});

// API: List registered candidates (for club admin view)
app.get('/api/registrations', (_req, res) => {
  const list = readRegistrations();
  res.json(list);
});

// API: Submit Registration
app.post('/api/register', async (req, res) => {
  const config = readConfig();
  if (config.allowRegistrations === false) {
    return res.status(403).json({ success: false, error: 'Les inscriptions sont temporairement closes.' });
  }

  const { fullName, email, phone, fieldOfStudy, studyLevel, interests, motivation, consent } = req.body;

  // Validation
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Veuillez renseigner un nom complet valide (minimum 2 caractères).' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Veuillez renseigner une adresse e-mail valide.' });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
    return res.status(400).json({ success: false, error: 'Veuillez renseigner un numéro de téléphone ou WhatsApp valide.' });
  }

  if (!studyLevel || typeof studyLevel !== 'string' || studyLevel.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Veuillez sélectionner votre niveau d’études.' });
  }

  if (!Array.isArray(interests) || interests.length === 0) {
    return res.status(400).json({ success: false, error: 'Veuillez sélectionner au moins un domaine d’intérêt.' });
  }

  if (!consent) {
    return res.status(400).json({ success: false, error: 'Votre consentement au traitement des données est obligatoire pour valider votre inscription.' });
  }

  const scriptUrl = config.googleAppsScriptUrl || GOOGLE_SCRIPT_URL;
  if (!scriptUrl || !scriptUrl.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Veuillez configurer l’URL de votre Google Apps Script Web App (GOOGLE_SCRIPT_URL) dans le fichier src/config.ts pour enregistrer les candidatures dans Google Sheets.',
    });
  }

  // Sanitization (Prevent XSS)
  const sanitize = (str: string) => str.replace(/<[^>]*>?/gm, '').trim();

  const cleanEmail = email.trim().toLowerCase();
  const registrations = readRegistrations();

  const newEntry = {
    fullName: sanitize(fullName),
    email: cleanEmail,
    phone: sanitize(phone),
    fieldOfStudy: fieldOfStudy ? sanitize(fieldOfStudy) : '',
    studyLevel: sanitize(studyLevel),
    interests: interests.map((i: string) => sanitize(String(i))),
    motivation: motivation ? sanitize(String(motivation)) : '',
    consent: true,
  };

  // Envoi réel vers le Google Apps Script Web App
  try {
    const scriptResponse = await fetch(scriptUrl.trim(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    });

    if (!scriptResponse.ok) {
      return res.status(502).json({
        success: false,
        error: `Le Web App Google Apps Script a répondu avec une erreur HTTP ${scriptResponse.status}.`,
      });
    }

    const scriptResult = await scriptResponse.json().catch(() => null);

    if (!scriptResult || scriptResult.success !== true) {
      return res.status(400).json({
        success: false,
        error: (scriptResult && scriptResult.error) 
          ? scriptResult.error 
          : 'L’enregistrement dans la feuille Google Sheets a échoué.',
      });
    }

    // Enregistrement confirmé par Google Sheets
    const confirmedEntry = {
      id: scriptResult.id || `CI-${new Date().getFullYear()}-${String(registrations.length + 1).padStart(4, '0')}`,
      ...newEntry,
      createdAt: scriptResult.timestamp || new Date().toISOString(),
      syncedToSheet: true,
    };

    // Mémorisation dans la base locale
    registrations.unshift(confirmedEntry);
    writeRegistrations(registrations);

    return res.status(201).json({
      success: true,
      id: confirmedEntry.id,
      message: scriptResult.message || 'Candidature enregistrée avec succès dans la feuille Google Sheets « Inscriptions ».',
      timestamp: confirmedEntry.createdAt,
      syncedToSheet: true,
    });
  } catch (netErr: any) {
    return res.status(500).json({
      success: false,
      error: `Impossible de contacter Google Apps Script : ${netErr.message || 'Erreur réseau'}. Vérifiez votre connexion et les autorisations du Web App.`,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development mode with Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serve
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Club Informatique server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
