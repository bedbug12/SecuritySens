export interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: 'facile' | 'moyen' | 'difficile';
  duration: number;
  questions: number;
  avgScore: number;
  completionRate: number;
}

export const games: Game[] = [
  {
    id: 'true-false',
    title: 'Vrai ou Faux ?',
    description: 'Testez vos connaissances avec des affirmations sur le social engineering',
    icon: '🎯',
    difficulty: 'facile',
    duration: 5,
    questions: 10,
    avgScore: 72,
    completionRate: 95
  },
  {
    id: 'spot-signs',
    title: 'Repère les signaux',
    description: 'Identifiez les indices d\'une attaque de social engineering',
    icon: '🔍',
    difficulty: 'moyen',
    duration: 8,
    questions: 5,
    avgScore: 65,
    completionRate: 88
  },
  {
    id: 'mail-inbox',
    title: 'Boîte mail sécurisée',
    description: 'Triez les emails légitimes des tentatives de phishing',
    icon: '📧',
    difficulty: 'difficile',
    duration: 10,
    questions: 8,
    avgScore: 58,
    completionRate: 82
  },
  {
    id: 'bias-buster',
    title: 'Chasse aux biais',
    description: 'Reconnaissez les biais cognitifs exploités par les attaquants',
    icon: '🧠',
    difficulty: 'moyen',
    duration: 7,
    questions: 12,
    avgScore: 68,
    completionRate: 90
  }
];

export const gameScenarios = [
  {
    id: 'scenario-1',
    title: 'Demande d\'ami sur LinkedIn',
    description: 'Un recruteur vous contacte sur LinkedIn avec une offre alléchante, mais demande des informations sensibles sur votre entreprise.',
    type: 'pretexting',
    difficulty: 'moyen',
    correctSigns: ['sign-1', 'sign-3', 'sign-5'],
    allSigns: [
      { id: 'sign-1', text: 'Offre trop belle pour être vraie', description: 'Salaire 50% supérieur au marché' },
      { id: 'sign-2', text: 'Profil professionnel complet', description: 'Photo, expérience, recommandations' },
      { id: 'sign-3', text: 'Demande d\'infos confidentielles', description: 'Demande des détails sur les projets internes' },
      { id: 'sign-4', text: 'Contact via réseau professionnel', description: 'Plateforme légitime comme LinkedIn' },
      { id: 'sign-5', text: 'Pression pour répondre vite', description: 'Délai de réponse très court' },
      { id: 'sign-6', text: 'Langage professionnel', description: 'Communication formelle et polie' }
    ]
  },
  {
    id: 'scenario-2',
    title: 'QR code dans le parking',
    description: 'Un QR code a été collé sur votre pare-brise dans le parking de l\'entreprise avec la mention "Scan pour gagner un cadeau".',
    type: 'qr',
    difficulty: 'facile',
    correctSigns: ['sign-2', 'sign-4', 'sign-6'],
    allSigns: [
      { id: 'sign-1', text: 'Dans le parking de l\'entreprise', description: 'Zone sécurisée de l\'entreprise' },
      { id: 'sign-2', text: 'Colle non professionnelle', description: 'Colle bon marché, application bâclée' },
      { id: 'sign-3', text: 'Message promotionnel', description: 'Offre de cadeau ou réduction' },
      { id: 'sign-4', text: 'Aucun logo d\'entreprise', description: 'Pas d\'identification officielle' },
      { id: 'sign-5', text: 'QR code lisible', description: 'Code correctement imprimé' },
      { id: 'sign-6', text: 'Demande d\'autorisations', description: 'L\'application demande trop d\'accès' }
    ]
  }
];