/**
 * Conseils de sécurité généraux
 */
export const generalSecurityTips = [
  "Ne partagez jamais vos mots de passe, même avec des collègues",
  "Verrouillez toujours votre poste de travail lorsque vous vous éloignez",
  "Signalez immédiatement tout comportement suspect",
  "Utilisez des mots de passe forts et uniques pour chaque service",
  "Activez l'authentification à deux facteurs lorsque possible",
  "Méfiez-vous des demandes urgentes ou inhabituelles",
  "Vérifiez toujours l'identité de vos interlocuteurs",
  "Ne tailgatez jamais et ne laissez personne tailgater"
];

/**
 * Conseils spécifiques au phishing
 */
export const phishingTips = [
  "Vérifiez l'adresse email complète, pas seulement le nom affiché",
  "Méfiez-vous des emails avec des pièces jointes inattendues",
  "Ne cliquez pas sur les liens dans les emails suspects",
  "Survolez les liens pour voir la vraie URL avant de cliquer",
  "Les entreprises légitimes n'envoient pas d'emails non sollicités avec des pièces jointes",
  "Recherchez les fautes d'orthographe et de grammaire",
  "Méfiez-vous des emails qui créent un sentiment d'urgence",
  "Utilisez le bouton 'Signaler' de votre client email"
];

/**
 * Conseils spécifiques au vishing
 */
export const vishingTips = [
  "Les équipes IT ne demandent jamais vos identifiants par téléphone",
  "Demandez le nom et le numéro de l'appelant, puis rappelez via le numéro officiel",
  "Ne donnez jamais d'informations sensibles par téléphone",
  "Méfiez-vous des appels qui créent un sentiment de panique",
  "Les entreprises légitimes vous donnent toujours le temps de vérifier",
  "Notez les détails de l'appel (heure, numéro, nom)",
  "Signalez les appels suspects à votre équipe sécurité",
  "Utilisez des questions de vérification que seul l'interlocuteur légitime peut connaître"
];

/**
 * Conseils spécifiques au tailgating
 */
export const tailgatingTips = [
  "Chaque personne doit utiliser son propre badge pour entrer",
  "Ne laissez jamais entrer quelqu'un sans badge visible",
  "Demandez toujours à voir le badge d'entreprise",
  "Escortez les visiteurs non accompagnés",
  "Les zones sécurisées doivent rester verrouillées",
  "Signalez les personnes sans badge à la sécurité",
  "Ne tailgatez pas et ne laissez personne tailgater",
  "Respectez les procédures d'accès en vigueur"
];

/**
 * Conseils pour les QR codes
 */
export const qrTips = [
  "Ne scannez jamais de QR codes inattendus",
  "Vérifiez l'origine du QR code avant de le scanner",
  "Les QR codes officiels sont toujours accompagnés d'une communication officielle",
  "Utilisez un scanner qui prévisualise l'URL avant d'ouvrir",
  "Méfiez-vous des QR codes collés dans les lieux publics",
  "Les QR codes ne doivent pas demander des autorisations excessives",
  "Signalez les QR codes suspects à la sécurité",
  "Privilégiez les méthodes d'authentification traditionnelles"
];

/**
 * Conseils pour les réseaux sociaux
 */
export const socialMediaTips = [
  "Ne partagez pas d'informations sensibles sur l'entreprise",
  "Vérifiez les profils avant d'accepter des demandes de connexion",
  "Les recruteurs légitimes n'envoient pas de messages non sollicités",
  "Méfiez-vous des offres trop belles pour être vraies",
  "Ne cliquez pas sur les liens dans les messages suspects",
  "Utilisez des paramètres de confidentialité stricts",
  "Signalez les comptes suspects",
  "Formez-vous aux techniques d'ingénierie sociale"
];

/**
 * Conseils par type de biais cognitif
 */
export const biasAwarenessTips: Record<string, string[]> = {
  'Autorité': [
    "Vérifiez les ordres inhabituels via un autre canal",
    "Les vraies figures d'autorité permettent la vérification",
    "Méfiez-vous des demandes qui contournent les procédures",
    "Utilisez toujours les canaux de communication officiels"
  ],
  'Urgence': [
    "Prenez toujours le temps de réfléchir",
    "Les vraies urgences permettent la vérification",
    "Méfiez-vous des délais artificiellement courts",
    "Consultez un collègue ou votre supérieur"
  ],
  'Confiance': [
    "Vérifiez l'identité, même pour des personnes connues",
    "Les attaquants peuvent usurper des identités",
    "Utilisez des questions de vérification personnelles",
    "Ne faites pas confiance basé uniquement sur l'apparence"
  ],
  'Preuve sociale': [
    "Basez vos décisions sur les faits, pas sur le comportement des autres",
    "Juste parce que d'autres le font ne veut pas dire que c'est sûr",
    "Suivez toujours les procédures établies",
    "Signalez les comportements inhabituels"
  ]
};

/**
 * Obtenir des conseils par type de menace
 */
export const getTipsByThreatType = (type: string): string[] => {
  switch(type.toLowerCase()) {
    case 'phishing':
      return phishingTips;
    case 'vishing':
      return vishingTips;
    case 'tailgating':
      return tailgatingTips;
    case 'qr':
      return qrTips;
    case 'pretexting':
      return socialMediaTips;
    default:
      return generalSecurityTips;
  }
};

/**
 * Obtenir un conseil aléatoire
 */
export const getRandomTip = (type?: string): string => {
  const tips = type ? getTipsByThreatType(type) : generalSecurityTips;
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
};

/**
 * Conseils pour améliorer le score de vigilance
 */
export const vigilanceImprovementTips = [
  "Participez régulièrement aux formations sécurité",
  "Analysez vos erreurs pour comprendre les techniques utilisées",
  "Entraînez-vous avec différents types de scénarios",
  "Restez à jour sur les nouvelles techniques d'attaque",
  "Partagez vos expériences avec vos collègues",
  "Appliquez les conseils dans votre quotidien professionnel",
  "Soyez proactif dans la signalisation des incidents",
  "Maintenez un niveau constant de scepticisme sain"
];