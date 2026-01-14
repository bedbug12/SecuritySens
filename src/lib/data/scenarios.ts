export interface Scenario {
  id: string;
  title: string;
  description: string;
  type: 'phishing' | 'vishing' | 'pretexting' | 'tailgating' | 'qr';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  completionRate?: number;
  data: any;
  biases: string[];
  tips: string[];
}

export const scenarios: Scenario[] = [
  {
    id: 'phishing-ceo',
    title: 'Email urgent du PDG',
    description: 'Un email prétendant venir du PDG demande un virement urgent',
    type: 'phishing',
    difficulty: 'beginner',
    estimatedTime: 8,
    completionRate: 87,
    biases: ['Autorité', 'Urgence', 'Confiance'],
    tips: [
      'Vérifiez toujours l\'adresse email complète',
      'Méfiez-vous des demandes de virement urgentes',
      'Confirmez par un autre canal de communication',
      'Signalez tout email suspect à l\'équipe sécurité'
    ],
    data: {
      email: {
        from: { name: 'Jean Dupont', email: 'ceo@yourcompany-solution.com' },
        to: 'vous@entreprise.com',
        subject: 'URGENT : Virement à effectuer dans l\'heure',
        body: `
          <p>Bonjour,</p>
          <p>Je suis en réunion importante et ne peux pas téléphoner.</p>
          <p>Je vous demande d'effectuer un virement urgent de <strong>45.000€</strong> 
          au compte suivant pour régler une facture critique :</p>
          <p style="background: #2a2a2a; padding: 15px; border-radius: 5px; margin: 15px 0;">
            IBAN: FR76 3000 4000 0100 1234 5678 900<br>
            BIC: BNPAFRPPXXX<br>
            Société: Global Services Solutions
          </p>
          <p>Ce virement doit être effectué <strong>dans l'heure</strong> sous peine 
          de pénalités importantes pour l'entreprise.</p>
          <p>Merci de me confirmer une fois effectué.</p>
          <p>Cordialement,<br>
          <strong>Jean Dupont</strong><br>
          PDG de YourCompany</p>
        `,
        attachments: [
          { name: 'facture_urgente.pdf', size: '2.4 MB', type: 'PDF', malicious: true }
        ],
        links: [
          { text: 'Voir les détails du projet', url: 'http://yourcompany-verify.com/login', malicious: true }
        ],
        urgencyLevel: 'high'
      },
      redFlags: [
        { type: 'sender', description: 'Adresse email légèrement différente de l\'officielle', severity: 'high' },
        { type: 'urgency', description: 'Demande de virement extrêmement urgente', severity: 'high' },
        { type: 'request', description: 'Demande financière inhabituelle par email', severity: 'high' },
        { type: 'link', description: 'Lien vers un domaine non officiel', severity: 'medium' }
      ],
      correctAction: 'report'
    }
  },
  {
    id: 'vishing-it',
    title: 'Appel du support IT',
    description: 'Un prétendu technicien IT appelle pour "résoudre un problème critique"',
    type: 'vishing',
    difficulty: 'intermediate',
    estimatedTime: 10,
    completionRate: 65,
    biases: ['Urgence', 'Autorité technique', 'Aide présumée'],
    tips: [
      'Ne donnez jamais vos identifiants par téléphone',
      'Vérifiez l\'identité de l\'interlocuteur via le service IT officiel',
      'Les équipes IT ne demandent jamais vos mots de passe',
      'Rappelez le service IT via le numéro officiel'
    ],
    data: {
      call: {
        caller: {
          name: 'Marc du Support IT',
          company: 'Support Technique Entreprise',
          number: '+33 1 23 45 67 89',
          spoofed: true
        },
        pretext: 'Nous détectons une activité virale sur votre poste de travail',
        request: 'J\'ai besoin que vous installiez ce logiciel de diagnostic à distance et me donniez vos identifiants',
        pressureTactics: ['urgence', 'conséquences graves', 'aide immédiate'],
        tone: 'urgent',
        backgroundNoise: true
      },
      redFlags: [
        { type: 'caller', description: 'Numéro non officiel de l\'entreprise', severity: 'high' },
        { type: 'request', description: 'Demande d\'identifiants par téléphone', severity: 'high' },
        { type: 'pressure', description: 'Pression excessive pour agir immédiatement', severity: 'high' },
        { type: 'credentials', description: 'Tentative d\'obtention d\'identifiants', severity: 'high' }
      ],
      correctAction: 'verify'
    }
  },
  {
    id: 'tailgating-reception',
    title: 'Visiteur à la réception',
    description: 'Une personne sans badge tente d\'entrer dans les locaux',
    type: 'tailgating',
    difficulty: 'beginner',
    estimatedTime: 6,
    completionRate: 92,
    biases: ['Preuve sociale', 'Réciprocité', 'Confiance'],
    tips: [
      'Vérifiez toujours le badge d\'accès',
      'Ne tailgatez jamais',
      'Escortez les visiteurs non accompagnés',
      'Signalez les personnes suspectes à la sécurité'
    ],
    data: {
      situation: {
        location: 'Entrée principale du bâtiment',
        time: 'Lundi matin, heure d\'affluence',
        person: {
          appearance: 'Homme bien habillé, portant une mallette',
          behavior: 'Semble pressé, suit de près un employé qui entre',
          story: 'J\'ai un rendez-vous avec le service RH, mon badge n\'a pas été activé',
          items: ['Aucun badge visible', 'Porte une mallette professionnelle', 'Semble connaître le nom du service'],
          suspicious: true
        },
        context: 'Vous êtes à l\'entrée du bâtiment. Une personne inconnue tente d\'entrer sans badge.'
      },
      redFlags: [
        { type: 'appearance', description: 'Pas de badge d\'entreprise visible', severity: 'high' },
        { type: 'behavior', description: 'Tente d\'entrer en suivant un employé', severity: 'high' },
        { type: 'story', description: 'Excuse peu crédible pour l\'absence de badge', severity: 'medium' },
        { type: 'timing', description: 'Choisit un moment d\'affluence', severity: 'medium' }
      ],
      correctAction: 'verify'
    }
  }
];