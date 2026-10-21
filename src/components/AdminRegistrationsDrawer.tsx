import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Download, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { RegistrationData } from '../types';
import { downloadRegistrationsCSV, fetchServerRegistrations } from '../services/api';

interface AdminRegistrationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: RegistrationData[];
  onRefresh: () => void;
}

export const AdminRegistrationsDrawer: React.FC<AdminRegistrationsDrawerProps> = ({
  isOpen,
  onClose,
  registrations,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);

  const filteredCandidates = useMemo(() => {
    return registrations.filter((cand) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = 
        !q || 
        cand.fullName.toLowerCase().includes(q) || 
        cand.email.toLowerCase().includes(q) || 
        (cand.fieldOfStudy || '').toLowerCase().includes(q);

      const matchLevel = selectedLevel === 'all' || cand.studyLevel === selectedLevel;
      const matchDomain = selectedDomain === 'all' || cand.interests.includes(selectedDomain);

      return matchSearch && matchLevel && matchDomain;
    });
  }, [registrations, searchQuery, selectedLevel, selectedDomain]);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    downloadRegistrationsCSV(filteredCandidates.length > 0 ? filteredCandidates : registrations);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#0c0c22] border-l border-[#00F5FF]/20 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                Gestion des Candidatures
              </h3>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30 tabular-nums">
                {registrations.length} dossier{registrations.length > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Espace réservé au bureau du Club Informatique
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              title="Rafraîchir les candidatures"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Export */}
        <div className="p-4 border-b border-slate-800/80 bg-[#080816]/60 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher par nom, e-mail, filière..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5FF]"
              />
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 hover:border-[#00F5FF] bg-slate-900 text-xs font-mono text-slate-200 hover:text-[#00F5FF] transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exporter CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-300 focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="all">Tous les niveaux d'études</option>
              <option value="Licence 1 / CP1">Licence 1 / CP1</option>
              <option value="Licence 2 / CP2">Licence 2 / CP2</option>
              <option value="Licence 3">Licence 3</option>
              <option value="Master 1 / Ingénieur 1">Master 1 / Ingénieur 1</option>
              <option value="Master 2 / Ingénieur 2">Master 2 / Ingénieur 2</option>
              <option value="Doctorat">Doctorat</option>
            </select>

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-300 focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="all">Tous les domaines d'intérêt</option>
              <option value="Web Development">Web Development</option>
              <option value="IA">Intelligence Artificielle</option>
              <option value="Cybersécurité">Cybersécurité</option>
              <option value="Réseaux">Réseaux</option>
              <option value="Programmation">Programmation</option>
              <option value="Robotique">Robotique</option>
            </select>
          </div>
        </div>

        {/* Candidate List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredCandidates.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <User className="h-10 w-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400 font-medium">
                {registrations.length === 0 ? 'Aucune candidature enregistrée pour le moment.' : 'Aucun résultat ne correspond à vos filtres.'}
              </p>
              <p className="text-xs text-slate-500">
                Les nouvelles inscriptions soumises via le formulaire apparaîtront ici automatiquement.
              </p>
            </div>
          ) : (
            filteredCandidates.map((cand) => {
              const isExpanded = expandedCandidateId === cand.id;
              return (
                <div
                  key={cand.id || cand.email}
                  className="rounded-xl border border-slate-800 bg-[#080816]/80 p-4 transition-all hover:border-slate-700 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {cand.fullName}
                        </h4>
                        <span className="font-mono text-[10px] text-slate-400">
                          {cand.id}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
                        {cand.studyLevel && (
                          <>
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3.5 w-3.5 text-[#8B5CF6]" />
                              {cand.studyLevel}
                            </span>
                            <span>·</span>
                          </>
                        )}
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5 text-[#00F5FF]" />
                          {cand.fieldOfStudy}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {cand.syncedToSheet ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          Google Sheets
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                          <Clock className="h-3 w-3 text-amber-400" />
                          Base locale
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Direct Contact Links */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={`mailto:${cand.email}`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-[#00F5FF] bg-slate-900/80 px-2 py-1 rounded border border-slate-800"
                    >
                      <Mail className="h-3 w-3 text-[#00F5FF]" />
                      <span>{cand.email}</span>
                    </a>
                    <a
                      href={`tel:${cand.phone}`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 hover:text-emerald-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800"
                    >
                      <Phone className="h-3 w-3 text-emerald-400" />
                      <span>{cand.phone}</span>
                    </a>
                  </div>

                  {/* Interests tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cand.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800 bg-slate-900/90 text-slate-300"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  {/* Motivation Accordion Toggle */}
                  {cand.motivation && (
                    <div className="pt-2 border-t border-slate-800/60">
                      <button
                        type="button"
                        onClick={() => setExpandedCandidateId(isExpanded ? null : (cand.id || ''))}
                        className="text-[11px] font-mono text-[#8B5CF6] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>{isExpanded ? 'Masquer la motivation' : 'Lire la motivation du candidat'}</span>
                      </button>
                      {isExpanded && (
                        <p className="mt-2 text-xs text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 leading-relaxed font-normal">
                          {cand.motivation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#080816] flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>{filteredCandidates.length} candidat(s) affiché(s)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-900"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
