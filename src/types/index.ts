export interface RegistrationData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  fieldOfStudy?: string;
  studyLevel: string;
  interests: string[];
  motivation?: string;
  consent: boolean;
  createdAt?: string;
  syncedToSheet?: boolean;
}

export type StudyLevel = 
  | 'Licence 1 / CP1'
  | 'Licence 2 / CP2'
  | 'Licence 3'
  | 'Master 1 / Ingénieur 1'
  | 'Master 2 / Ingénieur 2'
  | 'Doctorat';

export interface TechDomain {
  id: string;
  title: string;
  tagline: string;
  description: string;
  topics: string[];
  color: 'cyan' | 'purple' | 'magenta';
  icon: string;
}

export interface ClubActivity {
  id: string;
  title: string;
  category: string;
  description: string;
  details: string[];
  image?: string;
  accent: 'cyan' | 'purple' | 'magenta';
}

export interface ClubConfig {
  adminEmail: string;
  googleAppsScriptUrl: string;
  allowRegistrations: boolean;
}
