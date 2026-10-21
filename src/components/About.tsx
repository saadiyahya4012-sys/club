import React from 'react';
import { BookOpen, Layers, Lightbulb, Users, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const pillars = [
    {
      index: '01',
      title: 'Apprendre',
      subtitle: 'Workshops & Formations Techniques',
      description: 'Accède à des ateliers pratiques hebdomadaires animés par des étudiants expérimentés et des professionnels du secteur pour maîtriser les outils et langages les plus modernes.',
      highlights: [
        'Formations orientées pratique (hands-on coding)',
        'Accompagnement adapté aux débutants et profils avancés',
        'Ressources documentées et partage de veille technologique'
      ],
      icon: BookOpen,
      accentBorder: 'hover:border-[#00F5FF]/50',
      iconColor: 'text-[#00F5FF]',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]',
    },
    {
      index: '02',
      title: 'Créer',
      subtitle: 'Projets Collaboratifs & Défis',
      description: 'Conçois des applications concrètes au sein d’équipes pluridisciplinaires. Du brainstorming initial à la mise en production, expérimente le cycle de vie réel d’un logiciel.',
      highlights: [
        'Projets open-source à impact réel',
        'Méthodologies d’ingénierie logicielle et travail en équipe',
        'Constitution d’un portfolio technique tangible'
      ],
      icon: Layers,
      accentBorder: 'hover:border-[#8B5CF6]/50',
      iconColor: 'text-[#8B5CF6]',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]',
    },
    {
      index: '03',
      title: 'Innover',
      subtitle: 'Nouvelles Technologies & Échanges',
      description: 'Explore les frontières de l’intelligence artificielle, de la cybersécurité et de la robotique. Partage tes idées dans un espace bienveillant propice à l’émulation créative.',
      highlights: [
        'Exploration des modèles d’IA et technologies émergentes',
        'Conférences thématiques avec ingénieurs et chercheurs',
        'Participation aux hackathons et concours nationaux'
      ],
      icon: Lightbulb,
      accentBorder: 'hover:border-[#FF38D1]/50',
      iconColor: 'text-[#FF38D1]',
      glowColor: 'group-hover:shadow-[0_0_30px_rgba(255,56,209,0.15)]',
    },
  ];

  return (
    <section id="a-propos" className="relative py-20 lg:py-28 border-t border-slate-800/80 bg-[#080816]">
      {/* Background soft glow */}
      <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#8B5CF6]/5 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="font-mono text-xs font-bold tracking-[0.2em] text-[#00F5FF] uppercase">
            Notre Raison d'Être
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Plus qu’un club, une communauté.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Le Club Informatique rassemble les passionnés de sciences du numérique de l’université. Notre mission est d’offrir un tremplin pratique pour explorer la technologie, collaborer sur des projets stimulants, consolider ses compétences en programmation et préparer son avenir dans l’écosystème tech.
          </p>
        </div>

        {/* 3 Editorial Feature Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.index}
                className={`group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0e0e24]/70 p-7 lg:p-8 transition-all duration-300 ${pillar.accentBorder} ${pillar.glowColor} backdrop-blur-sm`}
              >
                <div>
                  {/* Card Header with Editorial Numbering and Icon */}
                  <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                    <span className="font-mono text-sm font-semibold tracking-wider text-slate-400">
                      {pillar.index}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-900/80">
                      <Icon className={`h-5 w-5 ${pillar.iconColor}`} />
                    </div>
                  </div>

                  {/* Card Title & Content */}
                  <div className="pt-6 space-y-2.5">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-wider text-[#00F5FF]/90 font-medium">
                      {pillar.subtitle}
                    </p>
                    <p className="pt-2 text-sm text-slate-300 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="mt-8 pt-6 border-t border-slate-800/60 space-y-2.5">
                  {pillar.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${pillar.iconColor}`} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ambient Community Banner */}
        <div className="mt-14 rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0d0d26] via-[#121235] to-[#0d0d26] p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#00F5FF]/30 bg-[#00F5FF]/10 text-[#00F5FF]">
              <Users className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">
                Un environnement bienveillant ouvert à tous les étudiants
              </h4>
              <p className="text-sm text-slate-300 max-w-2xl font-normal">
                Que tu sois en première année découvrant tes premières lignes de code ou en fin de cycle master développant des architectures distribuées, chacun y a sa place et son rôle à jouer.
              </p>
            </div>
          </div>
          <a
            href="#inscription"
            className="whitespace-nowrap shrink-0 px-5 py-2.5 text-xs font-mono font-semibold tracking-wider uppercase text-[#00F5FF] border border-[#00F5FF]/40 hover:bg-[#00F5FF]/10 rounded-xl transition-colors"
          >
            Rejoindre la communauté →
          </a>
        </div>

      </div>
    </section>
  );
};
