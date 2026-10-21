import React, { useState, useEffect } from 'react';
import { Laptop, Server, Cpu, Terminal, Radio, Shield, Globe } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  // Animation timeline phases (in milliseconds)
  const [step, setStep] = useState<number>(0);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Phase 1: Grid & Central workstation appear (0.2s)
    const t1 = setTimeout(() => setStep(1), 200);

    // Phase 2: Peripheral network nodes connect sequentially (0.6s to 1.8s)
    const t2 = setTimeout(() => setActiveNodes([0]), 700);
    const t3 = setTimeout(() => setActiveNodes([0, 1]), 1050);
    const t4 = setTimeout(() => setActiveNodes([0, 1, 2]), 1400);
    const t5 = setTimeout(() => setActiveNodes([0, 1, 2, 3]), 1750);
    const t6 = setTimeout(() => setActiveNodes([0, 1, 2, 3, 4]), 2100);

    // Phase 3: Energy convergence & Club Logo reveal (2.4s)
    const t7 = setTimeout(() => setStep(2), 2400);

    // Phase 4: Begin graceful fade-out (3.4s)
    const t8 = setTimeout(() => setIsFadingOut(true), 3400);

    // Phase 5: Complete and hand over to main application (3.8s)
    const t9 = setTimeout(() => onComplete(), 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
      clearTimeout(t9);
    };
  }, [onComplete]);

  // Network peripheral nodes surrounding the center
  const nodes = [
    { id: 0, label: 'Serveur Core', icon: Server, x: 20, y: 25, color: '#00F5FF' },
    { id: 1, label: 'Poste Dev Alpha', icon: Laptop, x: 80, y: 22, color: '#8B5CF6' },
    { id: 2, label: 'Cluster IA', icon: Cpu, x: 85, y: 72, color: '#FF38D1' },
    { id: 3, label: 'Nœud Cyber & CTF', icon: Shield, x: 15, y: 75, color: '#00F5FF' },
    { id: 4, label: 'Station IoT & Web', icon: Globe, x: 50, y: 88, color: '#8B5CF6' },
  ];

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080816] overflow-hidden select-none transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background lighting */}
      <div className="absolute inset-0 bg-cyber-grid opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#00F5FF]/15 via-[#8B5CF6]/15 to-[#FF38D1]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating subtle cyber particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#00F5FF] shadow-[0_0_8px_#00F5FF]"
            style={{
              top: `${(i * 19) % 100}%`,
              left: `${(i * 23) % 100}%`,
              opacity: 0.2 + ((i % 5) * 0.15),
              animation: `pulse ${(i % 3) + 2}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Skip button in top corner for instant access */}
      <button
        type="button"
        onClick={onComplete}
        className="absolute top-6 right-6 z-20 px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-[#00F5FF]/40 bg-slate-900/60 text-slate-400 hover:text-[#00F5FF] text-xs font-mono transition-all cursor-pointer backdrop-blur-sm"
      >
        Passer l'intro →
      </button>

      {/* SVG Network Lines Canvas */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cyanPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic connection lines between peripheral nodes and center (50%, 48%) */}
        {nodes.map((node) => {
          const isOnline = activeNodes.includes(node.id);
          return (
            <g key={node.id}>
              {/* Circuit Path Line */}
              <line
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2="50%"
                y2="48%"
                stroke={isOnline ? 'url(#cyanPurple)' : 'rgba(100, 116, 139, 0.15)'}
                strokeWidth={isOnline ? 2 : 1}
                strokeDasharray={isOnline ? '4 2' : 'none'}
                filter={isOnline ? 'url(#glowEffect)' : undefined}
                className="transition-all duration-700"
              />

              {/* Pulsing data packet along the active connection line */}
              {isOnline && (
                <circle
                  r="3.5"
                  fill="#00F5FF"
                  filter="url(#glowEffect)"
                >
                  <animateMotion
                    path={`M ${node.x * 10} ${node.y * 10} L 500 480`}
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Peripheral Computer & Server Nodes */}
      {nodes.map((node) => {
        const isOnline = activeNodes.includes(node.id);
        const Icon = node.icon;
        return (
          <div
            key={node.id}
            style={{
              top: `${node.y}%`,
              left: `${node.x}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute flex flex-col items-center gap-1.5 transition-all duration-500 ${
              isOnline
                ? 'opacity-100 scale-100'
                : 'opacity-20 scale-75'
            }`}
          >
            <div
              className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-500 ${
                isOnline
                  ? 'bg-slate-900/90 border-[#00F5FF] text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                  : 'bg-slate-950/70 border-slate-800 text-slate-600'
              }`}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span
              className={`hidden sm:block text-[10px] font-mono tracking-wider uppercase transition-colors duration-300 ${
                isOnline ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {node.label}
            </span>
          </div>
        );
      })}

      {/* Center Stage: Modern Computer Monitor transitioning to Official Club Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        
        {step < 2 ? (
          /* STEP 1: Modern Laptop / Workstation Booting & Connecting Network */
          <div
            className={`flex flex-col items-center transition-all duration-700 ${
              step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            {/* Modern Computer Display Frame */}
            <div className="relative w-64 sm:w-80 h-40 sm:h-48 rounded-xl border-2 border-[#00F5FF]/60 bg-[#0c0c24] p-3 shadow-[0_0_40px_rgba(0,245,255,0.35)] flex flex-col justify-between overflow-hidden">
              
              {/* Screen Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#00F5FF]">
                  <Radio className="h-3 w-3 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Terminal Matrix Network Log */}
              <div className="font-mono text-[11px] text-left space-y-1 text-slate-300 py-1">
                <p className="text-[#00F5FF] flex items-center gap-1">
                  <Terminal className="h-3 w-3" />
                  <span>&gt; club_network.init()</span>
                </p>
                <p className="text-slate-400">
                  Connexions actives : <span className="text-[#8B5CF6] font-bold">{activeNodes.length}/5</span> nœuds
                </p>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden mt-2">
                  <div
                    className="bg-gradient-to-r from-[#00F5FF] via-[#8B5CF6] to-[#FF38D1] h-full transition-all duration-300"
                    style={{ width: `${(activeNodes.length / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Screen Bottom Status */}
              <div className="text-[10px] font-mono text-slate-500 flex justify-between border-t border-slate-800/80 pt-1">
                <span>TCP/IP · P2P</span>
                <span className="text-[#00F5FF]/80">SYNCHRONISATION...</span>
              </div>

              {/* Neon scanline effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F5FF]/5 to-transparent h-12 w-full animate-pulse pointer-events-none" />
            </div>

            {/* Laptop Stand Base */}
            <div className="w-24 sm:w-28 h-3 bg-slate-800 border-t border-slate-700 rounded-b-md mx-auto shadow-md" />
            <div className="w-40 sm:w-48 h-1.5 bg-[#00F5FF]/30 rounded-full blur-xs mx-auto mt-1" />

            {/* Subtext */}
            <p className="mt-5 text-xs font-mono text-slate-400 tracking-wider flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00F5FF] animate-ping" />
              <span>DÉPLOIEMENT DU RÉSEAU UNIVERSITAIRE TECH...</span>
            </p>
          </div>
        ) : (
          /* STEP 2: Official IT Club Logo Revealed with Luminous Cyber Glow */
          <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Custom </> Official Logo Box */}
            <div className="relative group">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#00F5FF] via-[#8B5CF6] to-[#FF38D1] opacity-75 blur-xl animate-pulse" />
              
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-[#080816] border-2 border-[#00F5FF] text-[#00F5FF] shadow-[0_0_35px_rgba(0,245,255,0.7)]">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight">
                  &lt;/&gt;
                </span>
              </div>
            </div>

            {/* Official Club Name */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-white text-glow-cyan">
                CLUB INFORMATIQUE
              </h1>
              
              {/* Tagline */}
              <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-[#00F5FF] font-bold">
                CONNECT · CODE · CREATE
              </p>
            </div>

            {/* Welcome Badge */}
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
              <span>RÉSEAU INITIALISÉ · BIENVENUE</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
