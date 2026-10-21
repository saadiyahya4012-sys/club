import React from 'react';
import { Terminal, Database } from 'lucide-react';

interface FooterProps {
  onOpenSheetsGuide: () => void;
  onOpenAdmin: () => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSheetsGuide, onOpenAdmin, onReplayIntro }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-[#060612] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Brand & Tagline */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00F5FF]/20 to-[#8B5CF6]/20 border border-[#00F5FF]/30 text-[#00F5FF]">
                <span className="font-mono text-xs font-bold">&lt;/&gt;</span>
              </div>
              <span className="text-base font-bold tracking-wider text-white">
                CLUB INFORMATIQUE
              </span>
            </div>
            
            <p className="font-mono text-xs tracking-widest text-[#00F5FF]/80 uppercase">
              CONNECT. CODE. CREATE.
            </p>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-normal">
              Association étudiante dédiée à la promotion de la culture numérique, des technologies d'avenir, de l'apprentissage collaboratif et de l'innovation logicielle.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#accueil" className="hover:text-[#00F5FF] transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#a-propos" className="hover:text-[#00F5FF] transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#domaines" className="hover:text-[#00F5FF] transition-colors">
                  Nos domaines technologiques
                </a>
              </li>
              <li>
                <a href="#activites" className="hover:text-[#00F5FF] transition-colors">
                  Activités & Ateliers
                </a>
              </li>
              <li>
                <a href="#inscription" className="hover:text-[#00F5FF] transition-colors">
                  Formulaire d'inscription
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Administration */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Contact & Équipe
            </h4>
            
            <div className="space-y-1.5 text-xs text-slate-400">
              <p>Bureau du Club Informatique Universitaire</p>
              <p className="font-mono text-slate-300">
                E-mail : <a href="mailto:contact@club-informatique.edu" className="hover:text-[#00F5FF] underline">contact@club-informatique.edu</a>
              </p>
              <p className="text-[11px] text-slate-500 pt-1">
                Permanences étudiantes et sessions hebdomadaires au local associatif.
              </p>
            </div>

            {/* Admin, sheets and replay intro tools */}
            <div className="pt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenSheetsGuide}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-slate-400 hover:text-[#00F5FF] border border-slate-800 hover:border-[#00F5FF]/40 rounded-lg bg-slate-900/60 transition-colors cursor-pointer"
              >
                <Terminal className="h-3 w-3 text-[#00F5FF]" />
                <span>Doc Google Apps Script</span>
              </button>

              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-slate-400 hover:text-[#8B5CF6] border border-slate-800 hover:border-[#8B5CF6]/40 rounded-lg bg-slate-900/60 transition-colors cursor-pointer"
              >
                <Database className="h-3 w-3 text-[#8B5CF6]" />
                <span>Console Candidatures</span>
              </button>

              {onReplayIntro && (
                <button
                  type="button"
                  onClick={onReplayIntro}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-mono text-slate-500 hover:text-white border border-slate-800/80 hover:border-slate-700 rounded-lg bg-slate-900/40 transition-colors cursor-pointer"
                >
                  <span>Revoir l'intro</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom copyright notice */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© {currentYear} CLUB INFORMATIQUE · Tous droits réservés.</p>
          <p className="text-[11px] text-slate-600">
            Plateforme conçue pour la communauté universitaire tech
          </p>
        </div>
      </div>
    </footer>
  );
};
