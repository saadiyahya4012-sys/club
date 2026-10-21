import { TechDomain, ClubActivity } from '../types';

export const TECH_DOMAINS: TechDomain[] = [
  {
    id: 'web',
    title: 'Développement Web',
    tagline: 'Architectures modernes & Interfaces réactives',
    description: 'Conception d’applications web scalables, frameworks modernes, APIs REST/GraphQL, cloud computing et design UX/UI de pointe.',
    topics: ['React / Next.js', 'Node.js & Go', 'APIs & Microservices', 'Tailwind & Motion'],
    color: 'cyan',
    icon: 'Globe',
  },
  {
    id: 'ai',
    title: 'Intelligence Artificielle',
    tagline: 'Apprentissage machine & Modèles génératifs',
    description: 'Exploration pratique des réseaux de neurones, du traitement du langage naturel, de la vision par ordinateur et de l’intégration d’agents IA.',
    topics: ['Deep Learning', 'PyTorch & TensorFlow', 'Computer Vision', 'LLMs & Agents'],
    color: 'purple',
    icon: 'Brain',
  },
  {
    id: 'cyber',
    title: 'Cybersécurité',
    tagline: 'Défense active & Analyse de vulnérabilités',
    description: 'Compréhension des vecteurs d’attaques, cryptographie appliquée, sécurisation des infrastructures logicielles et participation aux compétitions CTF éthiques.',
    topics: ['Sécurité Applicative', 'Analyse Réseau', 'CTF / Pentesting Éthique', 'Cryptographie'],
    color: 'magenta',
    icon: 'ShieldCheck',
  },
  {
    id: 'programming',
    title: 'Programmation',
    tagline: 'Algorithmique & Conception logicielle',
    description: 'Renforcement des bases fondamentales en structures de données, optimisation algorithmique, architecture logicielle et programmation système.',
    topics: ['C++ & Rust', 'Python & TypeScript', 'Structures de Données', 'Clean Architecture'],
    color: 'cyan',
    icon: 'Code2',
  },
  {
    id: 'networks',
    title: 'Réseaux Informatiques',
    tagline: 'Infrastructures & Systèmes distribués',
    description: 'Protocoles de communication, routage, virtualisation, conteneurisation Docker/Kubernetes et administration de serveurs Linux.',
    topics: ['Protocoles TCP/IP', 'Linux & DevOps', 'Docker & Kubernetes', 'Architectures Cloud'],
    color: 'purple',
    icon: 'Server',
  },
  {
    id: 'robotics',
    title: 'Robotique',
    tagline: 'Systèmes embarqués & Internet des Objets',
    description: 'Programmation de microcontrôleurs, interfaçage de capteurs, automatisation mécatronique et prototypage de systèmes autonomes.',
    topics: ['Arduino & ESP32', 'Raspberry Pi', 'Capteurs & Actionneurs', 'IoT & Domotique'],
    color: 'magenta',
    icon: 'Cpu',
  },
];

export const CLUB_ACTIVITIES: ClubActivity[] = [
  {
    id: 'workshops',
    title: 'Ateliers Techniques',
    category: 'Pratique & Formation',
    description: 'Sessions immersives de programmation dirigée animées par des étudiants avancés ou des professionnels invités pour acquérir des compétences concrètes sur des technologies demandées.',
    details: [
      'Projets guidés pas-à-pas du code source au déploiement',
      'Environnement de développement prêt à l’emploi',
      'Mentorat personnalisé et entraide continue'
    ],
    image: '/src/assets/images/activity_tech_workshop_1792621238148.jpg',
    accent: 'cyan',
  },
  {
    id: 'hackathons',
    title: 'Hackathons',
    category: 'Innovation & Sprint',
    description: 'Marathons de programmation stimulants où des équipes pluridisciplinaires conçoivent, codent et présentent une solution technologique innovante dans un temps limité.',
    details: [
      'Immersion totale et travail d’équipe intense',
      'Défis concrets orientés impact technologique et social',
      'Présentations devant un jury de pairs et mentors'
    ],
    image: '/src/assets/images/activity_hackathon_1792621238509.jpg',
    accent: 'magenta',
  },
  {
    id: 'projects',
    title: 'Projets Collaboratifs',
    category: 'Développement d’Envergure',
    description: 'Réalisation d’applications et d’outils open-source au service du campus et de la communauté étudiante, avec gestion de version Git et revue de code rigoureuse.',
    details: [
      'Méthodologies agiles et gestion avec GitHub',
      'Revue de code collégiale et architecture logicielle',
      'Valorisation concrète dans vos portfolios techniques'
    ],
    accent: 'purple',
  },
  {
    id: 'conferences',
    title: 'Conférences et Rencontres',
    category: 'Échanges & Perspectives',
    description: 'Moments privilégiés d’échange avec des ingénieurs, alumni, chercheurs et acteurs de l’écosystème tech pour découvrir les réalités du marché et les métiers émergents.',
    details: [
      'Retours d’expérience sur les carrières technologiques',
      'Débats ouverts sur les évolutions du numérique et de l’IA',
      'Réseautage professionnel et conseils de recrutement'
    ],
    accent: 'cyan',
  },
  {
    id: 'challenges',
    title: 'Challenges de Programmation',
    category: 'Compétition & Algorithmique',
    description: 'Entraînements réguliers sur des plateformes de code compétitif pour perfectionner la résolution de problèmes complexes et se préparer aux entretiens techniques.',
    details: [
      'Problèmes d’optimisation et de complexité algorithmique',
      'Entraînement aux épreuves de code et concours universitaires',
      'Partage d’approches alternatives et meilleures pratiques'
    ],
    image: '/src/assets/images/activity_robotics_iot_1792621238009.jpg',
    accent: 'purple',
  },
];

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * ============================================================================
 * CODE GOOGLE APPS SCRIPT POUR CLUB INFORMATIQUE
 * Feuille cible : "Inscriptions"
 * ============================================================================
 * Ce script reçoit les candidatures via Web App, valide les données,
 * vérifie les doublons, enregistre la ligne dans la feuille "Inscriptions"
 * et envoie une alerte e-mail à l'administrateur.
 */

// 1. CONFIGURATION DE L'ADMINISTRATEUR (À PERSONNALISER SI SOUHAITÉ)
var ADMIN_EMAIL = "admin.clubinfo@universite.edu";
var CLUB_NAME = "CLUB INFORMATIQUE";
var SHEET_NAME = "Inscriptions";

/**
 * Point d'entrée HTTP POST pour recevoir les inscriptions depuis le formulaire web.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Verrou de 10 secondes pour empêcher les doublons de double-clic simultané
  var successLock = lock.tryLock(10000);
  if (!successLock) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Serveur occupé, veuillez réessayer dans quelques instants."
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    var data = {};
    
    // Analyse des données reçues (JSON, text/plain ou paramètres URL encodés)
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    // 1. Validation des champs obligatoires côté serveur
    if (!data.fullName || String(data.fullName).trim().length < 2) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Nom complet manquant ou invalide."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    var normalizedEmail = String(data.email || "").trim().toLowerCase();
    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Adresse e-mail invalide."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!data.phone || String(data.phone).trim().length < 6) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Numéro de téléphone ou WhatsApp manquant ou trop court."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!data.studyLevel || String(data.studyLevel).trim().length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Niveau d'études obligatoire non spécifié."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. Vérification du consentement RGPD obligatoire
    if (data.consent !== true && data.consent !== "true" && data.consent !== 1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Le consentement au traitement des données personnelles est obligatoire."
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Accès ou création de la feuille "Inscriptions"
    var sheet = getOrCreateInscriptionsSheet();
    var allRows = sheet.getDataRange().getValues();
    
    // 3. Prévention des doublons par e-mail
    // L'e-mail est stocké dans la colonne D (index 3, 0-indexed)
    var emailColIndex = 3;
    for (var i = 1; i < allRows.length; i++) {
      var existingEmail = String(allRows[i][emailColIndex] || "").trim().toLowerCase();
      if (existingEmail && existingEmail === normalizedEmail) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: "Une candidature avec cette adresse e-mail a déjà été enregistrée dans la feuille Inscriptions."
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // 4. Préparation de la ligne à insérer
    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, "GMT+1", "dd/MM/yyyy HH:mm:ss");
    var candidateId = "CI-" + Utilities.formatDate(timestamp, "GMT+1", "yyyy") + "-" + ("0000" + allRows.length).slice(-4);
    
    var interestsText = "";
    if (Array.isArray(data.interests)) {
      interestsText = data.interests.join(", ");
    } else {
      interestsText = String(data.interests || "Non spécifié");
    }
    
    var fieldOfStudy = String(data.fieldOfStudy || "").trim();
    var studyLevel = String(data.studyLevel || "").trim();
    var motivation = String(data.motivation || "").trim();
    
    // 5. Enregistrement réel dans la feuille Google Sheets
    sheet.appendRow([
      candidateId,
      formattedDate,
      String(data.fullName).trim(),
      normalizedEmail,
      String(data.phone).trim(),
      studyLevel,
      fieldOfStudy,
      interestsText,
      motivation,
      "Oui (Consentement accepté)",
      "Confirmé"
    ]);
    
    // Forcer l'écriture immédiate dans Google Sheets
    SpreadsheetApp.flush();
    
    // 6. Envoi de la notification e-mail à l'administrateur
    try {
      sendAdminNotification(candidateId, data, interestsText, formattedDate);
    } catch (mailErr) {
      Logger.log("Alerte: Impossible d'envoyer l'e-mail : " + mailErr.toString());
    }
    
    // 7. Réponse JSON de confirmation
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      id: candidateId,
      message: "Candidature enregistrée avec succès dans la feuille Inscriptions.",
      timestamp: formattedDate
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Erreur d'enregistrement : " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Erreur serveur Google Sheets : " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } finally {
    lock.releaseLock();
  }
}

/**
 * Point d'entrée HTTP GET pour vérifier que le Web App est en ligne.
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    club: CLUB_NAME,
    targetSheet: SHEET_NAME,
    time: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Récupère la feuille "Inscriptions" ou la crée avec les en-têtes officiels.
 */
function getOrCreateInscriptionsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Si la feuille est vide (aucun en-tête), on initialise les colonnes
  if (sheet.getLastRow() === 0) {
    var headers = [
      "ID Candidat",
      "Date & Heure",
      "Nom Complet",
      "Adresse E-mail",
      "Téléphone",
      "Niveau d'Études",
      "Filière d'Études",
      "Domaines d'Intérêt",
      "Motivation",
      "Consentement RGPD",
      "Statut"
    ];
    sheet.appendRow(headers);
    
    // Style visuel des en-têtes
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#080816");
    headerRange.setFontColor("#00F5FF");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
    
    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
  }
  
  return sheet;
}

/**
 * Envoie un e-mail de notification au responsable.
 */
function sendAdminNotification(id, data, interests, dateStr) {
  if (!ADMIN_EMAIL || ADMIN_EMAIL.indexOf("@") === -1) {
    return;
  }
  
  var subject = "🔔 Nouvelle Inscription [" + id + "] : " + data.fullName;
  var body = 
    "Bonjour,\\n\\n" +
    "Une nouvelle inscription a été enregistrée avec succès dans Google Sheets (" + SHEET_NAME + ") :\\n\\n" +
    "• Identifiant : " + id + "\\n" +
    "• Date : " + dateStr + "\\n" +
    "• Nom complet : " + data.fullName + "\\n" +
    "• E-mail : " + data.email + "\\n" +
    "• Téléphone : " + data.phone + "\\n" +
    "• Niveau d'études : " + data.studyLevel + "\\n" +
    "• Filière : " + (data.fieldOfStudy || "N/A") + "\\n" +
    "• Domaines d'intérêt : " + interests + "\\n\\n" +
    "Motivation :\\n" + (data.motivation ? data.motivation : "(Aucune motivation fournie)") + "\\n\\n" +
    "Consultez votre Google Sheet pour voir la ligne ajoutée en temps réel.\\n" +
    "--\\n" +
    CLUB_NAME + " - Système Automatisé";
    
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: subject,
    body: body
  });
}
`;
