import React from 'react';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';

interface HeroProps {
  onJoinClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinClick, onExploreClick }) => {
  return (
    <section id="accueil" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-cyber-grid opacity-75" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-b from-[#00F5FF]/10 via-[#8B5CF6]/10 to-transparent blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Clean status badge: Inscriptions ouvertes */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/5 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#00F5FF] shadow-[0_0_8px_#00F5FF]" />
              <span className="font-mono text-xs font-semibold tracking-wider text-[#00F5FF] uppercase">
                Inscriptions Ouvertes
              </span>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-xs text-slate-300 font-medium">Session Universitaire</span>
            </div>

            {/* Tagline kicker */}
            <div className="font-mono text-xs md:text-sm font-bold tracking-[0.25em] text-[#8B5CF6] uppercase">
              CONNECT · CODE · CREATE
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              Code the{' '}
              <span className="bg-gradient-to-r from-[#00F5FF] via-[#8B5CF6] to-[#FF38D1] bg-clip-text text-transparent">
                Future.
              </span>
            </h1>

            {/* Supporting French text */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              Rejoins une communauté de passionnés de technologie, développe tes compétences et transforme tes idées en projets concrets.
            </p>

            {/* Two CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onJoinClick}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold tracking-wide uppercase text-[#080816] bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] hover:from-[#3bf8ff] hover:to-[#9c73f7] rounded-xl transition-all duration-200 shadow-[0_0_25px_rgba(0,245,255,0.4)] hover:shadow-[0_0_35px_rgba(0,245,255,0.6)] cursor-pointer"
              >
                <span>Rejoindre le club</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white border border-slate-700 hover:border-[#00F5FF]/50 rounded-xl bg-slate-900/50 hover:bg-slate-800/60 backdrop-blur-sm transition-all duration-200 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
                <span>Découvrir nos activités</span>
              </button>
            </div>

            {/* Clean unboxed proof metadata */}
            <div className="flex flex-wrap items-center gap-3 pt-4 text-xs font-mono text-slate-400">
              <span className="text-[#00F5FF]">6 Pôles Techniques</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Projets Open Source</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Tous Niveaux Étudiants</span>
            </div>

          </div>

          {/* Right Column: Original Cyberpunk / High-Tech Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glowing decorative frame */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00F5FF]/30 via-[#8B5CF6]/30 to-[#FF38D1]/30 blur-lg opacity-70" />

              <div className="relative overflow-hidden rounded-2xl border border-[#00F5FF]/30 bg-[#0e0e24] shadow-2xl">
                
                {/* Visual Window Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#080816]/90 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-xs text-slate-400">club-informatique.sh</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#00F5FF]/80">
                    <Terminal className="h-3 w-3" />
                    <span>v2026.1</span>
                  </div>
                </div>

                {/* Main Generated High-Tech Visual */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src="/src/assets/images/hero_cyberpunk_visual_1792621235528.jpg"
                    alt="Visualisation futuriste des technologies du Club Informatique"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080816] via-transparent to-transparent opacity-80" />
                </div>

                {/* Futuristic Code Snippet Overlay */}
                <div className="border-t border-slate-800/80 bg-[#080816]/90 p-4 font-mono text-xs text-slate-300">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                    <span className="text-[#00F5FF]">// Innovation & Algorithmes</span>
                    <span className="text-[#FF38D1]">build();</span>
                  </div>
                  <p className="text-slate-300 pt-1">
                    <span className="text-[#8B5CF6]">const</span> student = <span className="text-[#00F5FF]">ClubInformatique</span>.enroll({'{'}
                  </p>
                  <p className="pl-4 text-slate-400">
                    passion: <span className="text-emerald-400">&quot;Technology&quot;</span>,
                  </p>
                  <p className="pl-4 text-slate-400">
                    mission: <span className="text-[#FF38D1]">&quot;Code the future&quot;</span>
                  </p>
                  <p className="text-slate-300">{'}'});</p>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
