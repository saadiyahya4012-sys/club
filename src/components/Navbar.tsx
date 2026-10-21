import React, { useState } from 'react';
import { Menu, X, Database } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  registeredCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  registeredCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Accueil', href: '#accueil' },
    { label: 'À propos', href: '#a-propos' },
    { label: 'Nos domaines', href: '#domaines' },
    { label: 'Activités', href: '#activites' },
    { label: 'Inscription', href: '#inscription' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#00F5FF]/15 bg-[#080816]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#accueil"
          className="group flex items-center gap-2.5 text-slate-100 hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#00F5FF]/20 to-[#8B5CF6]/20 border border-[#00F5FF]/40 text-[#00F5FF] group-hover:border-[#00F5FF] group-hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] transition-all">
            <span className="font-mono text-sm font-bold">&lt;/&gt;</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-wider text-white">
              CLUB INFORMATIQUE
            </span>
            <span className="font-mono text-[10px] tracking-widest text-[#00F5FF]/80 uppercase">
              Connect · Code · Create
            </span>
          </div>
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="relative py-1 text-slate-300 transition-colors hover:text-[#00F5FF] whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary CTA + Administrative Tools */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Admin candidate viewer */}
          <button
            type="button"
            onClick={onOpenAdmin}
            title="Consulter les candidatures enregistrées"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-[#8B5CF6] border border-slate-800 hover:border-[#8B5CF6]/40 rounded-lg bg-slate-900/60 transition-colors whitespace-nowrap"
          >
            <Database className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span className="hidden lg:inline">Candidats</span>
            <span className="text-[11px] font-semibold text-slate-200 tabular-nums">
              ({registeredCount})
            </span>
          </button>

          {/* Primary Action */}
          <a
            href="#inscription"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#inscription');
            }}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wider uppercase text-[#080816] bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] hover:from-[#38f8ff] hover:to-[#9d74f7] rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(0,245,255,0.3)] hover:shadow-[0_0_20px_rgba(0,245,255,0.5)] whitespace-nowrap shrink-0"
          >
            Rejoindre le club
          </a>

          {/* Mobile hamburger menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#00F5FF]/15 bg-[#080816]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:text-[#00F5FF] hover:bg-slate-800/40 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-mono text-slate-300 border border-slate-800 rounded-lg bg-slate-900/60"
            >
              <Database className="h-3.5 w-3.5 text-[#8B5CF6]" />
              <span>Consulter les candidatures ({registeredCount})</span>
            </button>

            <a
              href="#inscription"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#inscription');
              }}
              className="w-full flex items-center justify-center py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#080816] bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] rounded-lg"
            >
              Rejoindre le club
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
