import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Terminal, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_TEMPLATE } from '../data/clubData';
import { getClubConfig, saveClubConfig } from '../services/api';
import { GOOGLE_SCRIPT_URL } from '../config';

interface GoogleAppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAppsScriptModal: React.FC<GoogleAppsScriptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [webAppUrl, setWebAppUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const config = getClubConfig();
      setAdminEmail(config.adminEmail || 'saadiyahya4012@gmail.com');
      setWebAppUrl(GOOGLE_SCRIPT_URL || config.googleAppsScriptUrl || '');
      setSaveSuccess(false);
      setTestStatus('idle');
      setTestMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const updatedConfig = {
        adminEmail: adminEmail.trim(),
        googleAppsScriptUrl: webAppUrl.trim(),
        allowRegistrations: true,
      };

      // Save locally
      saveClubConfig(updatedConfig);

      // Save on server
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig),
      }).catch(() => null);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Ignored
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!webAppUrl.trim()) {
      setTestStatus('error');
      setTestMessage('Veuillez renseigner une URL Google Apps Script avant de lancer le test.');
      return;
    }

    setTestStatus('loading');
    setTestMessage('Envoi du ping de test vers Google Apps Script...');

    try {
      const res = await fetch('/api/test-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webAppUrl.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus('success');
        setTestMessage('Connexion réussie ! Le Web App Google Apps Script répond correctement.');
      } else {
        setTestStatus('error');
        setTestMessage(data.error || 'Échec de la connexion. Vérifiez les autorisations de votre Web App.');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(`Erreur de connexion : ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#00F5FF]/30 bg-[#0c0c22] p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Intégration Google Sheets & Google Apps Script
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Stockage automatique des candidatures & notifications par e-mail
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Configuration Panel */}
        <div className="rounded-xl border border-slate-800 bg-[#080816]/70 p-5 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#00F5FF] font-bold">
            Paramètres du Webhook Google Apps Script
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">
                E-mail de notification administrateur :
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="bureau.clubinfo@universite.edu"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-[#00F5FF] focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">
                L'administrateur recevra un e-mail à chaque nouvelle candidature.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">
                URL de l'application Web Google Apps Script :
              </label>
              <input
                type="url"
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-[#00F5FF] focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Générée après avoir déployé le script ci-dessous en application Web.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00F5FF] text-[#080816] text-xs font-bold uppercase tracking-wider hover:bg-[#38f8ff] transition-all cursor-pointer"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                <span>Enregistrer la configuration</span>
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'loading'}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 hover:border-[#8B5CF6] text-slate-200 text-xs font-mono hover:text-[#8B5CF6] transition-all cursor-pointer"
              >
                {testStatus === 'loading' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                <span>Tester la connexion</span>
              </button>
            </div>

            {saveSuccess && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Configuration enregistrée avec succès.
              </span>
            )}
          </div>

          {/* Test Status feedback */}
          {testStatus !== 'idle' && (
            <div className={`p-3 rounded-lg text-xs font-mono flex items-start gap-2 ${
              testStatus === 'success' 
                ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300' 
                : testStatus === 'error'
                ? 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
                : 'bg-slate-800/40 border border-slate-700 text-slate-300'
            }`}>
              {testStatus === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />}
              {testStatus === 'error' && <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />}
              {testStatus === 'loading' && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#00F5FF] mt-0.5" />}
              <span>{testMessage}</span>
            </div>
          )}
        </div>

        {/* Step-by-Step Setup Guide */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#8B5CF6] font-bold">
            Guide d’installation en 5 étapes
          </h4>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            <li className="rounded-lg border border-slate-800 bg-[#080816]/60 p-3 space-y-1">
              <span className="font-bold text-[#00F5FF]">1. Créer la feuille Google Sheets</span>
              <p className="text-slate-400">
                Créez un nouveau tableur sur Google Drive nommé <code className="text-white">Inscriptions Club Informatique</code>.
              </p>
            </li>
            <li className="rounded-lg border border-slate-800 bg-[#080816]/60 p-3 space-y-1">
              <span className="font-bold text-[#00F5FF]">2. Ouvrir l'éditeur Apps Script</span>
              <p className="text-slate-400">
                Dans le menu de votre feuille Google Sheets, cliquez sur <strong className="text-white">Extensions</strong> &gt; <strong className="text-white">Apps Script</strong>.
              </p>
            </li>
            <li className="rounded-lg border border-slate-800 bg-[#080816]/60 p-3 space-y-1">
              <span className="font-bold text-[#00F5FF]">3. Coller le code source</span>
              <p className="text-slate-400">
                Effacez le contenu existant du fichier <code className="text-white">Code.gs</code> et collez le script ci-dessous.
              </p>
            </li>
            <li className="rounded-lg border border-slate-800 bg-[#080816]/60 p-3 space-y-1">
              <span className="font-bold text-[#00F5FF]">4. Déployer en Application Web</span>
              <p className="text-slate-400">
                Cliquez sur <strong className="text-white">Déployer</strong> &gt; <strong className="text-white">Nouveau déploiement</strong> &gt; Sélectionner le type <strong className="text-white">Application Web</strong>. Choisissez <em>Exécuter en tant que : Moi</em> et <em>Qui a accès : Tout le monde</em>.
              </p>
            </li>
          </ol>
        </div>

        {/* Code Snippet Viewer with Copy */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-[#00F5FF]" />
              <span>Code.gs — Script complet prêt à copier</span>
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-700 hover:border-[#00F5FF] text-xs font-mono text-slate-200 hover:text-[#00F5FF] bg-slate-900 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier le script'}</span>
            </button>
          </div>

          <div className="relative max-h-60 overflow-y-auto rounded-xl border border-slate-800 bg-[#050510] p-4 font-mono text-[11px] text-slate-300 leading-relaxed">
            <pre>
              <code>{GOOGLE_APPS_SCRIPT_TEMPLATE}</code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
