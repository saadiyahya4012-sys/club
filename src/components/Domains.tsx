import React from 'react';
import { Globe, Brain, ShieldCheck, Code2, Server, Cpu, ChevronRight } from 'lucide-react';
import { TECH_DOMAINS } from '../data/clubData';

interface DomainsProps {
  onSelectDomainForRegistration: (domainTitle: string) => void;
}

const iconMap = {
  Globe,
  Brain,
  ShieldCheck,
  Code2,
  Server,
  Cpu,
};

export const Domains: React.FC<DomainsProps> = ({ onSelectDomainForRegistration }) => {
  return (
    <section id="domaines" className="relative py-20 lg:py-28 border-t border-slate-800/80 bg-[#080816]">
      {/* Background cyber grid */}
      <div className="pointer-events-none absolute inset-0 bg-cyber-grid-dense opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div className="max-w-2xl space-y-3">
            <div className="font-mono text-xs font-bold tracking-[0.2em] text-[#8B5CF6] uppercase">
              Spécialisations & Ateliers
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Nos domaines technologiques
            </h2>
            <p className="text-base text-slate-300 font-normal">
              Des pôles d’excellence structurés pour répondre aux exigences du monde professionnel et permettre à chaque étudiant d’approfondir ses affinités.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            <span>6 Pôles d’apprentissage actif</span>
          </div>
        </div>

        {/* 6 Technology Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {TECH_DOMAINS.map((domain) => {
            const Icon = iconMap[domain.icon as keyof typeof iconMap] || Code2;
            
            // Accent styling based on domain.color
            const accentClasses = {
              cyan: {
                borderHover: 'hover:border-[#00F5FF]/60',
                shadowHover: 'hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]',
                iconBg: 'bg-[#00F5FF]/10 border-[#00F5FF]/30 text-[#00F5FF]',
                tagBg: 'text-[#00F5FF]/90 border-[#00F5FF]/20',
              },
              purple: {
                borderHover: 'hover:border-[#8B5CF6]/60',
                shadowHover: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]',
                iconBg: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]',
                tagBg: 'text-[#8B5CF6]/90 border-[#8B5CF6]/20',
              },
              magenta: {
                borderHover: 'hover:border-[#FF38D1]/60',
                shadowHover: 'hover:shadow-[0_0_30px_rgba(255,56,209,0.2)]',
                iconBg: 'bg-[#FF38D1]/10 border-[#FF38D1]/30 text-[#FF38D1]',
                tagBg: 'text-[#FF38D1]/90 border-[#FF38D1]/20',
              },
            }[domain.color];

            return (
              <div
                key={domain.id}
                className={`group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0c0c22]/80 p-7 transition-all duration-300 ${accentClasses.borderHover} ${accentClasses.shadowHover} backdrop-blur-sm`}
              >
                <div>
                  {/* Top Bar with Icon */}
                  <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accentClasses.iconBg} transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-[11px] text-slate-500 uppercase tracking-widest">
                      Pôle #{domain.id}
                    </span>
                  </div>

                  {/* Title and descriptions */}
                  <div className="pt-5 space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-white transition-colors">
                      {domain.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      {domain.tagline}
                    </p>
                    <p className="pt-2 text-sm text-slate-300 leading-relaxed font-normal">
                      {domain.description}
                    </p>
                  </div>

                  {/* Topic checklist tags */}
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {domain.topics.map((topic, i) => (
                      <span
                        key={i}
                        className={`inline-block px-2.5 py-1 text-[11px] font-mono border rounded-md bg-slate-900/60 ${accentClasses.tagBg}`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="mt-7 pt-5 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => onSelectDomainForRegistration(domain.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white group/btn cursor-pointer"
                  >
                    <span>Choisir ce domaine dans ma candidature</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1 text-[#00F5FF]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
