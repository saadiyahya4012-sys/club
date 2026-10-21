import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap,
  ShieldAlert,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { RegistrationData } from '../types';
import { submitRegistration, getActiveGoogleScriptUrl } from '../services/api';

interface RegistrationFormProps {
  onSuccessRegistered?: () => void;
  selectedDomainHint?: string | null;
}

const STUDY_LEVEL_OPTIONS = [
  'Licence 1 / CP1',
  'Licence 2 / CP2',
  'Licence 3',
  'Master 1 / Ingénieur 1',
  'Master 2 / Ingénieur 2',
  'Doctorat',
];

const DOMAINS_LIST = [
  { id: 'Web Development', label: 'Web Development', desc: 'Frontend, Backend, APIs & Cloud' },
  { id: 'IA', label: 'IA (Intelligence Artificielle)', desc: 'Machine Learning, Deep Learning, LLMs' },
  { id: 'Cybersécurité', label: 'Cybersécurité', desc: 'Sécurité offensive, CTF, Défense' },
  { id: 'Réseaux', label: 'Réseaux', desc: 'Infrastructures, Systèmes Linux & DevOps' },
  { id: 'Programmation', label: 'Programmation', desc: 'Algorithmique, Structures & Systèmes' },
  { id: 'Robotique', label: 'Robotique', desc: 'Systèmes embarqués, IoT & Microcontrôleurs' },
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onSuccessRegistered,
  selectedDomainHint 
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    fieldOfStudy: '',
    studyLevel: '',
    interests: [] as string[],
    motivation: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedCandidate, setSubmittedCandidate] = useState<{
    id: string;
    fullName: string;
    email: string;
    phone: string;
    fieldOfStudy: string;
    studyLevel: string;
    interests: string[];
    syncedToSheet?: boolean;
    timestamp?: string;
  } | null>(null);

  // If a domain hint was passed from the Domains section, check it if not checked
  React.useEffect(() => {
    if (selectedDomainHint) {
      const match = DOMAINS_LIST.find(d => 
        selectedDomainHint.toLowerCase().includes(d.id.toLowerCase()) || 
        d.id.toLowerCase().includes(selectedDomainHint.toLowerCase())
      );
      if (match && !formData.interests.includes(match.id)) {
        setFormData(prev => ({ ...prev, interests: [...prev.interests, match.id] }));
      }
    }
  }, [selectedDomainHint]);

  // Real-time inline field validation
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'fullName':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return 'Veuillez saisir votre nom et prénom (au moins 2 caractères).';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(String(value).trim())) {
          return 'Veuillez saisir une adresse e-mail universitaire ou personnelle valide.';
        }
        break;
      case 'phone':
        // Clean phone validation (digits, +, spaces)
        const phoneClean = String(value).replace(/[\s-]/g, '');
        if (!phoneClean || phoneClean.length < 8) {
          return 'Veuillez saisir un numéro de téléphone ou WhatsApp valide.';
        }
        break;
      case 'fieldOfStudy':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return 'Veuillez préciser votre filière d’études (ex: Génie Informatique, MIAGE, Math-Info...).';
        }
        break;
      case 'studyLevel':
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Veuillez sélectionner votre niveau d’études.';
        }
        break;
      case 'interests':
        if (!Array.isArray(value) || value.length === 0) {
          return 'Veuillez cocher au moins un domaine d’intérêt technique.';
        }
        break;
      case 'consent':
        if (!value) {
          return 'Votre consentement au traitement des informations est requis.';
        }
        break;
      default:
        break;
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));

    // Clear inline error if field becomes valid
    const errorMsg = validateField(name, finalValue);
    setErrors(prev => {
      const next = { ...prev };
      if (errorMsg) {
        next[name] = errorMsg;
      } else {
        delete next[name];
      }
      return next;
    });

    if (submitError) setSubmitError(null);
  };

  const handleInterestToggle = (domainId: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(domainId);
      const nextInterests = exists 
        ? prev.interests.filter(i => i !== domainId)
        : [...prev.interests, domainId];

      const errorMsg = validateField('interests', nextInterests);
      setErrors(errs => {
        const next = { ...errs };
        if (errorMsg) next.interests = errorMsg;
        else delete next.interests;
        return next;
      });

      return { ...prev, interests: nextInterests };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const formErrors: Record<string, string> = {};
    (['fullName', 'email', 'phone', 'fieldOfStudy', 'studyLevel', 'interests', 'consent'] as const).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) formErrors[key] = err;
    });

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // Focus on first erroneous input
      const firstErrorField = Object.keys(formErrors)[0];
      const element = document.getElementById(`field-${firstErrorField}`);
      if (element) {
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: RegistrationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        fieldOfStudy: formData.fieldOfStudy,
        studyLevel: formData.studyLevel,
        interests: formData.interests,
        motivation: formData.motivation,
        consent: formData.consent,
      };

      const result = await submitRegistration(payload);

      // Enregistrement confirmé avec succès par Google Sheets
      setSubmittedCandidate({
        id: result.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        fieldOfStudy: formData.fieldOfStudy,
        studyLevel: formData.studyLevel,
        interests: formData.interests,
        syncedToSheet: result.syncedToSheet,
        timestamp: result.timestamp,
      });

      // Réinitialiser le formulaire uniquement après confirmation de réussite
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        fieldOfStudy: '',
        studyLevel: '',
        interests: [],
        motivation: '',
        consent: false,
      });
      setErrors({});

      if (onSuccessRegistered) {
        onSuccessRegistered();
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Une erreur inattendue est survenue lors de l’envoi. Veuillez vérifier votre connexion et l’URL Google Apps Script.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      fieldOfStudy: '',
      studyLevel: '',
      interests: [],
      motivation: '',
      consent: false,
    });
    setErrors({});
    setSubmitError(null);
    setSubmittedCandidate(null);
  };

  return (
    <section id="inscription" className="relative py-20 lg:py-28 border-t border-[#00F5FF]/15 bg-[#080816]">
      {/* Background radial and glow accents */}
      <div className="pointer-events-none absolute inset-0 bg-cyber-grid opacity-50" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-gradient-to-tr from-[#00F5FF]/5 via-[#8B5CF6]/10 to-[#FF38D1]/5 blur-[140px]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3.5 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/5 text-[#00F5FF] font-mono text-xs uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            <span>Formulaire Officiel d'Adhésion</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance">
            Prêt à rejoindre l’aventure ?
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto font-normal">
            Remplis ce formulaire pour soumettre ta candidature. Un membre du bureau prendra contact avec toi pour finaliser ton intégration au club.
          </p>
        </div>

        {/* Success Confirmation Card */}
        {submittedCandidate ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-[#0c191a]/90 p-8 sm:p-10 shadow-[0_0_40px_rgba(16,185,129,0.15)] backdrop-blur-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-emerald-500/20">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Candidature enregistrée avec succès !
                  </h3>
                  <p className="text-xs font-mono text-emerald-300">
                    Référence : <span className="font-bold underline tracking-wider">{submittedCandidate.id}</span>
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono px-3 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                Statut : En attente de validation
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <p>
                Félicitations <strong className="text-white">{submittedCandidate.fullName}</strong> ! Ta candidature pour rejoindre le <strong className="text-[#00F5FF]">CLUB INFORMATIQUE</strong> a été transmise à notre équipe.
              </p>

              <div className="rounded-xl border border-slate-800 bg-[#080816]/80 p-5 space-y-2.5 font-mono text-xs">
                <div className="text-[#00F5FF] font-bold pb-1 border-b border-slate-800">
                  RÉCAPITULATIF DU DOSSIER
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  <div>• <span className="text-slate-400">E-mail :</span> {submittedCandidate.email}</div>
                  <div>• <span className="text-slate-400">Téléphone :</span> {submittedCandidate.phone}</div>
                  <div>• <span className="text-slate-400">Niveau :</span> {submittedCandidate.studyLevel}</div>
                  <div>• <span className="text-slate-400">Filière :</span> {submittedCandidate.fieldOfStudy}</div>
                </div>
                <div className="pt-2 text-slate-300">
                  <span className="text-slate-400">Pôles choisis :</span> {submittedCandidate.interests.join(', ')}
                </div>
                <div className="pt-1 text-emerald-400 text-[11px]">
                  ✓ Données enregistrées dans la feuille Google Sheets « Inscriptions »
                </div>
              </div>

              <div className="rounded-xl border border-[#00F5FF]/20 bg-[#00F5FF]/5 p-4 text-xs text-slate-300 space-y-1.5">
                <p className="font-bold text-[#00F5FF]">Prochaines étapes :</p>
                <p>1. Tu recevras une confirmation par e-mail et une invitation sur le groupe WhatsApp des membres.</p>
                <p>2. Présente-toi à la prochaine session d'accueil ou atelier d'initiation au local du club.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-mono text-slate-300 hover:text-white border border-slate-700 hover:border-[#00F5FF]/40 rounded-lg bg-slate-900/60 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Soumettre une autre inscription</span>
              </button>

              <a
                href="#activites"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#080816] bg-[#00F5FF] hover:bg-[#3bf8ff] rounded-lg transition-all"
              >
                Découvrir le programme des activités →
              </a>
            </div>
          </div>
        ) : (
          /* Main Interactive Registration Form */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-slate-800 bg-[#0d0d26]/85 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8"
          >
            {/* Global Error Banner */}
            {submitError && (
              <div 
                role="alert" 
                className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300"
              >
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-rose-200">Erreur lors de la soumission</p>
                  <p className="text-xs text-rose-300/90">{submitError}</p>
                </div>
              </div>
            )}

            {/* Google Sheets Connection Notice if URL not set */}
            {!getActiveGoogleScriptUrl() && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200 font-mono">
                <span className="text-base">⚙️</span>
                <span>
                  Pour enregistrer les données dans Google Sheets, définissez votre URL <code className="text-white bg-slate-900/80 px-1.5 py-0.5 rounded">GOOGLE_SCRIPT_URL</code> dans <code className="text-[#00F5FF]">src/config.ts</code>.
                </span>
              </div>
            )}

            {/* Row 1: Nom complet & E-mail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Nom complet */}
              <div className="space-y-2">
                <label 
                  htmlFor="field-fullName" 
                  className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
                >
                  <User className="h-3.5 w-3.5 text-[#00F5FF]" />
                  <span>Nom complet <span className="text-[#FF38D1]">*</span></span>
                </label>
                <div className="relative">
                  <input
                    id="field-fullName"
                    name="fullName"
                    type="text"
                    required
                    disabled={isSubmitting}
                    placeholder="ex: Alexandre Dubois"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:outline-none ${
                      errors.fullName
                        ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-800 focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 pt-1 font-mono">
                    <ShieldAlert className="h-3 w-3 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Adresse e-mail */}
              <div className="space-y-2">
                <label 
                  htmlFor="field-email" 
                  className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
                >
                  <Mail className="h-3.5 w-3.5 text-[#00F5FF]" />
                  <span>Adresse e-mail <span className="text-[#FF38D1]">*</span></span>
                </label>
                <div className="relative">
                  <input
                    id="field-email"
                    name="email"
                    type="email"
                    required
                    disabled={isSubmitting}
                    placeholder="nom.prenom@universite.edu"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:outline-none ${
                      errors.email
                        ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                        : 'border-slate-800 focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 pt-1 font-mono">
                    <ShieldAlert className="h-3 w-3 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

            </div>

            {/* Row 2: Téléphone / WhatsApp & Filière d'études */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Téléphone / WhatsApp */}
              <div className="space-y-2">
                <label 
                  htmlFor="field-phone" 
                  className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
                >
                  <Phone className="h-3.5 w-3.5 text-[#8B5CF6]" />
                  <span>Téléphone / WhatsApp <span className="text-[#FF38D1]">*</span></span>
                </label>
                <input
                  id="field-phone"
                  name="phone"
                  type="tel"
                  required
                  disabled={isSubmitting}
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full rounded-xl border bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:outline-none ${
                    errors.phone
                      ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 pt-1 font-mono">
                    <ShieldAlert className="h-3 w-3 shrink-0" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Filière d’études */}
              <div className="space-y-2">
                <label 
                  htmlFor="field-fieldOfStudy" 
                  className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#8B5CF6]" />
                  <span>Filière d’études <span className="text-[#FF38D1]">*</span></span>
                </label>
                <input
                  id="field-fieldOfStudy"
                  name="fieldOfStudy"
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="ex: Informatique, Math-Info, MIAGE..."
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  className={`w-full rounded-xl border bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:outline-none ${
                    errors.fieldOfStudy
                      ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500'
                      : 'border-slate-800 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]'
                  }`}
                />
                {errors.fieldOfStudy && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 pt-1 font-mono">
                    <ShieldAlert className="h-3 w-3 shrink-0" />
                    <span>{errors.fieldOfStudy}</span>
                  </p>
                )}
              </div>

            </div>

            {/* Row 3: Niveau d'études */}
            <div className="space-y-2.5">
              <label 
                id="field-studyLevel" 
                className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
              >
                <GraduationCap className="h-3.5 w-3.5 text-[#FF38D1]" />
                <span>Niveau d’études <span className="text-[#FF38D1]">*</span></span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {STUDY_LEVEL_OPTIONS.map((level) => {
                  const isSelected = formData.studyLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, studyLevel: level }));
                        setErrors(prev => {
                          const next = { ...prev };
                          delete next.studyLevel;
                          return next;
                        });
                      }}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#00F5FF] bg-[#00F5FF]/10 text-white shadow-[0_0_12px_rgba(0,245,255,0.25)] font-semibold'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{level}</span>
                        {isSelected && <span className="h-2 w-2 rounded-full bg-[#00F5FF]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {errors.studyLevel && (
                <p className="text-xs text-rose-400 flex items-center gap-1 pt-1 font-mono">
                  <ShieldAlert className="h-3 w-3 shrink-0" />
                  <span>{errors.studyLevel}</span>
                </p>
              )}
            </div>

            {/* Domaines d'intérêt (Multiple selectable checkboxes) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label 
                  id="field-interests"
                  className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#00F5FF]" />
                  <span>Domaines d’intérêt technique <span className="text-[#FF38D1]">*</span></span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {formData.interests.length} sélectionné(s)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {DOMAINS_LIST.map((domain) => {
                  const isChecked = formData.interests.includes(domain.id);
                  return (
                    <label
                      key={domain.id}
                      className={`flex flex-col justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          disabled={isSubmitting}
                          checked={isChecked}
                          onChange={() => handleInterestToggle(domain.id)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-700 text-[#8B5CF6] focus:ring-[#8B5CF6] accent-[#8B5CF6]"
                        />
                        <div className="space-y-0.5">
                          <span className={`text-xs font-semibold block ${isChecked ? 'text-white' : 'text-slate-200'}`}>
                            {domain.label}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-normal">
                            {domain.desc}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {errors.interests && (
                <p className="text-xs text-rose-400 flex items-center gap-1 pt-1 font-mono">
                  <ShieldAlert className="h-3 w-3 shrink-0" />
                  <span>{errors.interests}</span>
                </p>
              )}
            </div>

            {/* Row 5: Motivation (Optional textarea) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="field-motivation" 
                  className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold"
                >
                  Pourquoi veux-tu rejoindre le club ? <span className="text-slate-500 font-normal lowercase">(facultatif)</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {formData.motivation.length}/600
                </span>
              </div>
              <textarea
                id="field-motivation"
                name="motivation"
                rows={3}
                maxLength={600}
                disabled={isSubmitting}
                placeholder="Décris tes centres d’intérêt, tes objectifs, les technologies que tu souhaites découvrir ou les projets que tu aimerais développer..."
                value={formData.motivation}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:border-[#00F5FF] focus:outline-none focus:ring-1 focus:ring-[#00F5FF] resize-none"
              />
            </div>

            {/* Row 6: Consent checkbox (Required) */}
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  id="field-consent"
                  name="consent"
                  type="checkbox"
                  required
                  disabled={isSubmitting}
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 rounded border-slate-700 text-[#00F5FF] focus:ring-[#00F5FF] accent-[#00F5FF]"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  J’accepte que les informations fournies soient traitées par le bureau du Club Informatique dans le cadre strict de l’organisation des activités, ateliers et communications associatives internes. <span className="text-[#FF38D1]">*</span>
                </span>
              </label>

              {errors.consent && (
                <p className="text-xs text-rose-400 flex items-center gap-1 pl-7 font-mono">
                  <ShieldAlert className="h-3 w-3 shrink-0" />
                  <span>{errors.consent}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative flex items-center justify-center gap-2 py-4 px-6 text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#080816] bg-gradient-to-r from-[#00F5FF] via-[#8B5CF6] to-[#FF38D1] hover:brightness-110 rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-[#080816]" />
                    <span>ENREGISTREMENT EN COURS...</span>
                  </>
                ) : (
                  <>
                    <span>S'INSCRIRE ↗</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Anti-spam & Privacy Notice */}
            <p className="text-center font-mono text-[11px] text-slate-500">
              Chaque inscription est vérifiée par le bureau du Club Informatique · Aucun démarchage commercial
            </p>

          </form>
        )}

      </div>
    </section>
  );
};
