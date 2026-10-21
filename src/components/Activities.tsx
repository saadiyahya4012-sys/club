import React from 'react';
import { CLUB_ACTIVITIES } from '../data/clubData';
import { Terminal, Users, Award, Code, Presentation } from 'lucide-react';

interface ActivitiesProps {
  onJoinClick: () => void;
}

const activityIcons: Record<string, React.ElementType> = {
  workshops: Terminal,
  hackathons: Award,
  projects: Code,
  conferences: Presentation,
  challenges: Users,
};

export const Activities: React.FC<ActivitiesProps> = ({ onJoinClick }) => {
  return (
    <section id="activites" className="relative py-20 lg:py-28 border-t border-slate-800/80 bg-[#080816]">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-0 bottom-1/4 h-80 w-80 rounded-full bg-[#00F5FF]/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14">
          <div className="max-w-2xl space-y-3">
            <div className="font-mono text-xs font-bold tracking-[0.2em] text-[#FF38D1] uppercase">
              La Vie du Club
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Nos activités régulières
            </h2>
            <p className="text-base text-slate-300 font-normal">
              Des formats pensés pour tous les rythmes : sessions de pratique intensive, marathons créatifs, échanges inspirants et apprentissage collectif.
            </p>
          </div>

          <button
            type="button"
            onClick={onJoinClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#080816] bg-[#00F5FF] hover:bg-[#3bf8ff] rounded-xl shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all whitespace-nowrap cursor-pointer"
          >
            Participer aux activités →
          </button>
        </div>

        {/* Dynamic Bento & Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CLUB_ACTIVITIES.map((activity, index) => {
            const Icon = activityIcons[activity.id] || Terminal;
            const isFeatured = index === 0 || index === 1;

            return (
              <div
                key={activity.id}
                className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-[#0e0e24]/80 backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:shadow-[0_0_30px_rgba(0,245,255,0.1)] ${
                  isFeatured ? 'lg:col-span-1' : ''
                }`}
              >
                {/* Visual Image if present */}
                {activity.image && (
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e24] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-3 left-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#00F5FF] bg-[#080816]/90 border border-[#00F5FF]/30 px-2.5 py-1 rounded-md backdrop-blur-md">
                        {activity.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content Area */}
                <div className={`flex flex-col justify-between flex-1 p-6 ${!activity.image ? 'pt-7' : ''}`}>
                  <div>
                    {!activity.image && (
                      <div className="flex items-center justify-between pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-[#8B5CF6]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                          {activity.category}
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#00F5FF] transition-colors">
                      {activity.title}
                    </h3>

                    <p className="mt-2.5 text-sm text-slate-300 leading-relaxed font-normal">
                      {activity.description}
                    </p>
                  </div>

                  {/* Highlights list */}
                  <div className="mt-6 pt-5 border-t border-slate-800/70 space-y-2">
                    {activity.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00F5FF]/70" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
