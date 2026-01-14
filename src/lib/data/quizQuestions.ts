export interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: boolean;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tip?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Les attaquants de social engineering utilisent souvent un sentiment d\'urgence pour vous faire agir sans réfléchir',
    correctAnswer: true,
    explanation: 'L\'urgence est une technique courante pour court-circuiter votre jugement critique. Les vraies urgences professionnelles permettent toujours une vérification.',
    difficulty: 'easy',
    tip: 'Méfiez-vous des délais extrêmement courts imposés par email ou téléphone.'
  },
  {
    id: 'q2',
    question: 'Il est acceptable de donner son mot de passe à un collègue de confiance si c\'est urgent',
    correctAnswer: false,
    explanation: 'Jamais. Les mots de passe sont personnels et confidentiels. Même vos collègues ne doivent pas les connaître. Utilisez les procédures de réinitialisation officielles.',
    difficulty: 'easy',
    tip: 'En cas d\'urgence, contactez le service IT via les canaux officiels.'
  },
  {
    id: 'q3',
    question: 'Un email provenant d\'une adresse corporate@entreprise.com est toujours légitime',
    correctAnswer: false,
    explanation: 'Les attaquants peuvent facilement créer des adresses similaires ou usurper des domaines. Vérifiez toujours l\'adresse complète et méfiez-vous des légères variations.',
    difficulty: 'medium',
    tip: 'Vérifiez le domaine après le @ et attention aux fautes d\'orthographe.'
  },
  {
    id: 'q4',
    question: 'Les attaques de social engineering ne ciblent que les cadres supérieurs',
    correctAnswer: false,
    explanation: 'Tous les employés sont des cibles potentielles. Les attaquants ciblent souvent les personnes ayant accès à des informations ou des systèmes spécifiques, quel que soit leur niveau hiérarchique.',
    difficulty: 'easy',
    tip: 'La sensibilisation au social engineering est importante pour tous les employés.'
  },
  {
    id: 'q5',
    question: 'Il est sécuritaire de scanner un QR code trouvé dans les locaux de l\'entreprise s\'il a le logo de l\'entreprise',
    correctAnswer: false,
    explanation: 'Non. Les attaquants peuvent facilement copier des logos. Ne scannez jamais de QR code inattendu, même dans l\'entreprise. Signalez-le à la sécurité.',
    difficulty: 'medium',
    tip: 'Les communications officielles utilisent des canaux vérifiés, pas des QR codes aléatoires.'
  },
  {
    id: 'q6',
    question: 'Les équipes IT légitimes peuvent parfois demander votre mot de passe pour résoudre un problème',
    correctAnswer: false,
    explanation: 'Les équipes IT professionnelles n\'ont jamais besoin de votre mot de passe. Elles peuvent réinitialiser votre compte ou utiliser des outils d\'administration qui ne nécessitent pas votre mot de passe.',
    difficulty: 'medium',
    tip: 'Signalez immédiatement toute demande d\'identifiants par téléphone ou email.'
  },
  {
    id: 'q7',
    question: 'La prévention du tailgating (entrée par suivage) est uniquement la responsabilité de la sécurité',
    correctAnswer: false,
    explanation: 'La sécurité physique est la responsabilité de tous les employés. Chacun doit vérifier que les personnes entrant ont un badge valide et ne pas laisser entrer des inconnus.',
    difficulty: 'easy',
    tip: 'Ne tailgatez jamais et ne laissez jamais quelqu\'un tailgater derrière vous.'
  },
  {
    id: 'q8',
    question: 'Un appel qui semble provenir d\'un numéro interne de l\'entreprise est forcément légitime',
    correctAnswer: false,
    explanation: 'Le spoofing d\'appel permet aux attaquants de falsifier le numéro affiché. Vérifiez toujours l\'identité de l\'appelant, même pour les numéros internes.',
    difficulty: 'hard',
    tip: 'Rappelez la personne via le répertoire officiel de l\'entreprise pour vérifier.'
  },
  {
    id: 'q9',
    question: 'Partager des informations anodines sur l\'entreprise sur les réseaux sociaux est sans danger',
    correctAnswer: false,
    explanation: 'Les attaquants assemblent des informations anodines pour créer des attaques ciblées (osint). Même des détails apparemment insignifiants peuvent être exploités.',
    difficulty: 'medium',
    tip: 'Appliquez les politiques de confidentialité de l\'entreprise sur les réseaux sociaux.'
  },
  {
    id: 'q10',
    question: 'La formation au social engineering n\'est nécessaire qu\'une fois par an',
    correctAnswer: false,
    explanation: 'Les techniques d\'attaque évoluent constamment. Une formation régulière et des rappels fréquents sont essentiels pour maintenir la vigilance.',
    difficulty: 'easy',
    tip: 'Participez régulièrement aux formations et simulations de sécurité.'
  }
];