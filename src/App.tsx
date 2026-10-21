import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Domains } from './components/Domains';
import { Activities } from './components/Activities';
import { RegistrationForm } from './components/RegistrationForm';
import { Footer } from './components/Footer';
import { GoogleAppsScriptModal } from './components/GoogleAppsScriptModal';
import { AdminRegistrationsDrawer } from './components/AdminRegistrationsDrawer';
import { IntroAnimation } from './components/IntroAnimation';
import { RegistrationData } from './types';
import { fetchServerRegistrations } from './services/api';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState(false);
  const [selectedDomainHint, setSelectedDomainHint] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);

  const loadRegistrations = useCallback(async () => {
    const list = await fetchServerRegistrations();
    setRegistrations(list);
  }, []);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const scrollToRegistration = () => {
    const el = document.getElementById('inscription');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToActivities = () => {
    const el = document.getElementById('activites');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDomainForRegistration = (domainTitle: string) => {
    setSelectedDomainHint(domainTitle);
    scrollToRegistration();
  };

  return (
    <>
      {/* Futuristic Network Intro Animation (shown at startup for 3-4s) */}
      {showIntro && (
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      )}

      {/* Main Application Container with clean fade-in */}
      <div 
        className={`min-h-screen bg-[#080816] text-slate-100 flex flex-col font-sans selection:bg-[#00F5FF]/25 selection:text-[#00F5FF] transition-opacity duration-700 ${
          showIntro ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'
        }`}
      >
      {/* Sleek Cyberpunk Navigation Bar */}
      <Navbar
        onOpenAdmin={() => setIsAdminDrawerOpen(true)}
        registeredCount={registrations.length}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onJoinClick={scrollToRegistration}
          onExploreClick={scrollToActivities}
        />

        {/* About Section */}
        <About />

        {/* 6 Technology Tracks & Domains */}
        <Domains
          onSelectDomainForRegistration={handleSelectDomainForRegistration}
        />

        {/* Activities Section */}
        <Activities
          onJoinClick={scrollToRegistration}
        />

        {/* Registration Form (Main Conversion Goal) */}
        <RegistrationForm
          onSuccessRegistered={loadRegistrations}
          selectedDomainHint={selectedDomainHint}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenSheetsGuide={() => setIsSheetsModalOpen(true)}
        onOpenAdmin={() => setIsAdminDrawerOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* Google Sheets Integration & Webhook Guide Modal */}
      <GoogleAppsScriptModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
      />

      {/* Admin Candidatures Management Drawer */}
      <AdminRegistrationsDrawer
        isOpen={isAdminDrawerOpen}
        onClose={() => setIsAdminDrawerOpen(false)}
        registrations={registrations}
        onRefresh={loadRegistrations}
      />
      </div>
    </>
  );
}
