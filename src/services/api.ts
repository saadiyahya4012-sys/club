import { RegistrationData, ClubConfig } from '../types';
import { GOOGLE_SCRIPT_URL } from '../config';

const STORAGE_KEY = 'club_informatique_registrations';
const CONFIG_KEY = 'club_informatique_config';

const DEFAULT_CONFIG: ClubConfig = {
  adminEmail: 'saadiyahya4012@gmail.com',
  googleAppsScriptUrl: GOOGLE_SCRIPT_URL || '',
  allowRegistrations: true,
};

export function getActiveGoogleScriptUrl(): string {
  if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.trim()) {
    return GOOGLE_SCRIPT_URL.trim();
  }
  const local = getClubConfig();
  return (local.googleAppsScriptUrl || '').trim();
}

export async function submitRegistration(data: RegistrationData): Promise<{ 
  success: boolean; 
  id: string; 
  message: string; 
  timestamp?: string;
  syncedToSheet?: boolean;
}> {
  const activeScriptUrl = getActiveGoogleScriptUrl();

  // Client-side payload sanitization
  const payload = {
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    fieldOfStudy: (data.fieldOfStudy || '').trim(),
    studyLevel: data.studyLevel.trim(),
    interests: data.interests,
    motivation: (data.motivation || '').trim(),
    consent: data.consent === true,
  };

  // 1. Essai prioritaire via le proxy serveur (évite 100% des restrictions CORS du navigateur)
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        scriptUrl: activeScriptUrl,
      }),
    });

    const result = await response.json().catch(() => null);

    if (response.ok && result && result.success === true) {
      // Succès réel confirmé par Google Sheets
      saveLocalRegistration({
        ...payload,
        id: result.id,
        createdAt: result.timestamp || new Date().toISOString(),
        syncedToSheet: true,
      });
      return {
        success: true,
        id: result.id,
        message: result.message || 'Candidature enregistrée avec succès dans la feuille Google Sheets « Inscriptions ».',
        timestamp: result.timestamp,
        syncedToSheet: true,
      };
    } else {
      // Erreur remontée par le serveur ou le script
      throw new Error(
        (result && result.error) ||
        `Échec de la validation (${response.status}). Les données n'ont pas pu être enregistrées dans Google Sheets.`
      );
    }
  } catch (serverErr: any) {
    // Si l'erreur provient déjà d'une validation métier (ex: e-mail doublon ou champ manquant)
    if (serverErr.message && !serverErr.message.includes('fetch') && !serverErr.message.includes('NetworkError')) {
      throw serverErr;
    }

    // 2. Si le proxy local est injoignable, tentative directe vers Google Apps Script
    if (!activeScriptUrl) {
      throw new Error(
        'Veuillez renseigner votre URL Google Apps Script Web App (GOOGLE_SCRIPT_URL) dans le fichier src/config.ts.'
      );
    }

    try {
      const directResponse = await fetch(activeScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });

      const directResult = await directResponse.json().catch(() => null);

      if (directResult && directResult.success === true) {
        saveLocalRegistration({
          ...payload,
          id: directResult.id,
          createdAt: directResult.timestamp || new Date().toISOString(),
          syncedToSheet: true,
        });
        return {
          success: true,
          id: directResult.id,
          message: directResult.message || 'Candidature enregistrée avec succès dans Google Sheets.',
          timestamp: directResult.timestamp,
          syncedToSheet: true,
        };
      } else {
        throw new Error(
          (directResult && directResult.error) ||
          "Google Apps Script n'a pas pu confirmer l'enregistrement."
        );
      }
    } catch (directErr: any) {
      throw new Error(
        directErr.message ||
        "Impossible d'enregistrer la candidature dans Google Sheets. Veuillez vérifier votre URL Google Apps Script et vos autorisations."
      );
    }
  }
}

export function getLocalRegistrations(): RegistrationData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveLocalRegistration(entry: RegistrationData) {
  try {
    const list = getLocalRegistrations();
    const index = list.findIndex(r => r.email === entry.email || r.id === entry.id);
    if (index >= 0) {
      list[index] = entry;
    } else {
      list.unshift(entry);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Storage save failed', err);
  }
}

export function getClubConfig(): ClubConfig {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (!stored) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveClubConfig(config: ClubConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Config save failed', err);
  }
}

export async function fetchServerRegistrations(): Promise<RegistrationData[]> {
  try {
    const res = await fetch('/api/registrations');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch {
    // fallback
  }
  return getLocalRegistrations();
}

export function downloadRegistrationsCSV(registrations: RegistrationData[]) {
  const headers = ['ID', 'Date', 'Nom Complet', 'Email', 'Telephone', 'Filiere', 'Niveau', 'Domaines', 'Motivation', 'Statut Synchro'];
  const rows = registrations.map(r => [
    `"${r.id || ''}"`,
    `"${r.createdAt || ''}"`,
    `"${(r.fullName || '').replace(/"/g, '""')}"`,
    `"${r.email || ''}"`,
    `"${r.phone || ''}"`,
    `"${(r.fieldOfStudy || '').replace(/"/g, '""')}"`,
    `"${r.studyLevel || ''}"`,
    `"${(r.interests || []).join('; ')}"`,
    `"${(r.motivation || '').replace(/"/g, '""')}"`,
    `"${r.syncedToSheet ? 'Synchronisé Google Sheets' : 'Enregistré localement'}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `club_informatique_candidatures_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
