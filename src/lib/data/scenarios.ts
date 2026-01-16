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
  },
  {
    id: 'qr-parking',
    title: 'QR code suspect sur un véhicule',
    description: 'Un QR code collé sur un pare-brise en parking promet une récompense',
    type: 'qr',
    difficulty: 'intermediate',
    estimatedTime: 10,
    completionRate: 72,
    biases: ['Curiosité', 'Gain personnel', 'Confiance'],
    tips: [
      'Ne scannez jamais des QR codes dont vous ne connaissez pas l\'origine',
      'Vérifiez l\'apparence du QR code (qualité, intégration)',
      'Signalez les QR codes suspects à la sécurité',
      'Utilisez un scanner qui prévisualise l\'URL avant d\'ouvrir',
      'Méfiez-vous des promesses de récompenses ou cadeaux'
    ],
    data: {
      qrCode: {
        context: {
          location: 'Parking de l\'entreprise, sur un pare-brise',
          appearance: 'Imprimé sur papier autocollant de mauvaise qualité',
          message: 'Scannez pour gagner un bon d\'essence de 50€ !'
        },
        scanResult: {
          url: 'https://bit.ly/3xY7zKp-promo',
          permissions: ['accès à la localisation', 'accès aux contacts', 'accès à la caméra'],
          legitimacy: false,
          redirectsTo: 'http://malicious-site.com/steal-data',
          asksFor: ['nom', 'email professionnel', 'numéro de badge']
        }
      },
      redFlags: [
        { type: 'location', description: 'QR code collé sur un véhicule', severity: 'high' },
        { type: 'appearance', description: 'Qualité amateur, impression bon marché', severity: 'medium' },
        { type: 'message', description: 'Promesse de récompense trop belle', severity: 'high' },
        { type: 'url', description: 'Lien raccourci (bit.ly) masquant la vraie destination', severity: 'high' },
        { type: 'permissions', description: 'Demande d\'accès aux contacts et localisation', severity: 'high' }
      ],
      correctAction: 'report'
    }
  },
  
  // Autre scénario QR Code - variante
  {
    id: 'qr-wifi-public',
    title: 'QR code pour WiFi public',
    description: 'Un QR code dans un café promet un accès WiFi gratuit',
    type: 'qr',
    difficulty: 'advanced',
    estimatedTime: 12,
    completionRate: 58,
    biases: ['Convenience', 'Conformité sociale', 'Confiance'],
    tips: [
      'Vérifiez l\'origine des QR codes dans les lieux publics',
      'Préférez toujours les réseaux WiFi officiels',
      'Utilisez un VPN sur les réseaux publics',
      'Ne saisissez jamais d\'identifiants professionnels sur des réseaux non sécurisés',
      'Signalez les bornes WiFi suspectes'
    ],
    data: {
      qrCode: {
        context: {
          location: 'Café près du bureau, sur une table',
          appearance: 'Élégant, intégré dans un présentoir officiel',
          message: 'Accès WiFi gratuit - Scannez pour vous connecter'
        },
        scanResult: {
          url: 'http://free-wifi-setup.com/connect',
          permissions: ['accès au réseau', 'accès aux fichiers', 'installation d\'application'],
          legitimacy: false,
          redirectsTo: 'http://phishing-login.com/office365',
          asksFor: ['email professionnel', 'mot de passe']
        }
      },
      redFlags: [
        { type: 'location', description: 'Lieu public sans surveillance', severity: 'medium' },
        { type: 'setup', description: 'Processus de connexion trop complexe', severity: 'high' },
        { type: 'permissions', description: 'Demande d\'installation d\'application', severity: 'high' },
        { type: 'requests', description: 'Demande d\'identifiants professionnels', severity: 'critical' }
      ],
      correctAction: 'ignore'
    }
  },
  
  // Scénario Pretexting (nouveau type)
  {
    id: 'pretexting-linkedin',
    title: 'Recruteur suspect sur LinkedIn',
    description: 'Un prétendu recruteur cherche à obtenir des informations sensibles',
    type: 'pretexting',
    difficulty: 'advanced',
    estimatedTime: 15,
    completionRate: 61,
    biases: ['Ambition', 'Autorité', 'Réciprocité'],
    tips: [
      'Vérifiez l\'authenticité des recruteurs sur LinkedIn',
      'Ne partagez jamais d\'informations sensibles en ligne',
      'Utilisez les canaux officiels pour les échanges professionnels',
      'Signalez les profils suspects',
      'Protégez les informations sur votre société actuelle'
    ],
    data: {
      interaction: {
        platform: 'linkedin',
        persona: {
          role: 'Head Hunter pour une grande entreprise tech',
          company: 'TechTalent Solutions',
          story: 'Nous cherchons un expert pour un poste très rémunérateur'
        },
        request: 'Pouvez-vous me partager des exemples de projets récents pour évaluer votre fit ?',
        informationSought: [
          'Détails techniques de projets en cours',
          'Architecture système interne',
          'Méthodes de sécurité utilisées',
          'Organigramme de l\'équipe'
        ]
      },
      redFlags: [
        'Profil récent avec peu de connexions',
        'Demande d\'informations sensibles dès le premier contact',
        'Pression pour obtenir rapidement des informations',
        'Histoire peu crédible sur l\'opportunité',
        'Refus de communiquer via des canaux officiels'
      ],
      correctAction: 'verify'
    }
  },
  
  // Scénario Phishing avancé
  {
    id: 'phishing-hr-policy',
    title: 'Mise à jour des politiques RH',
    description: 'Un email prétendant venir des RH demande de confirmer ses informations',
    type: 'phishing',
    difficulty: 'intermediate',
    estimatedTime: 9,
    completionRate: 68,
    biases: ['Autorité RH', 'Conformité', 'Peur des conséquences'],
    tips: [
      'Les RH communiquent rarement par email pour les mises à jour sensibles',
      'Vérifiez l\'URL du portail de connexion',
      'Ne cliquez jamais sur les liens dans ce type d\'email',
      'Connectez-vous directement au portail RH officiel',
      'Signalez immédiatement à l\'équipe sécurité'
    ],
    data: {
      email: {
        from: { 
          name: 'Service des Ressources Humaines', 
          email: 'rh-notifications@yourcompany-update.com' 
        },
        to: 'vous@entreprise.com',
        subject: 'ACTION REQUISE : Mise à jour de vos informations personnelles',
        body: `
          <p>Cher(e) collaborateur(trice),</p>
          <p>Suite à la mise à jour de notre politique de sécurité, nous devons vérifier et mettre à jour vos informations personnelles.</p>
          <p><strong>Vous devez mettre à jour vos informations avant le 15/12/2023 pour éviter la suspension de votre compte.</strong></p>
          <p>Cliquez sur le lien ci-dessous pour accéder à votre espace personnel et procéder à la mise à jour :</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="http://yourcompany-hr-portal.com/login" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Mettre à jour mes informations
            </a>
          </p>
          <p>Si vous rencontrez des problèmes, répondez simplement à cet email avec vos identifiants actuels et nous vous aiderons.</p>
          <p>Cordialement,<br>
          <strong>Service des Ressources Humaines</strong><br>
          YourCompany</p>
        `,
        attachments: [],
        links: [
          { 
            text: 'Mettre à jour mes informations', 
            url: 'http://yourcompany-hr-portal.com/login', 
            malicious: true 
          }
        ],
        urgencyLevel: 'high'
      },
      redFlags: [
        { type: 'sender', description: 'Domaine différent de celui officiel', severity: 'high' },
        { type: 'urgency', description: 'Menace de suspension de compte', severity: 'high' },
        { type: 'request', description: 'Demande d\'identifiants par email', severity: 'critical' },
        { type: 'link', description: 'Lien vers un faux portail RH', severity: 'high' }
      ],
      correctAction: 'report'
    }
  },
  
  // Scénario Vishing avancé
  {
    id: 'vishing-bank-fraud',
    title: 'Alerte fraude bancaire',
    description: 'Un prétendu agent bancaire appelle pour "confirmer une transaction suspecte"',
    type: 'vishing',
    difficulty: 'advanced',
    estimatedTime: 14,
    completionRate: 55,
    biases: ['Peur', 'Urgence', 'Confiance en l\'autorité'],
    tips: [
      'Votre banque ne vous appellera jamais pour demander vos codes',
      'Ne donnez jamais d\'informations bancaires au téléphone',
      'Rappelez directement votre banque via le numéro officiel',
      'Les banques utilisent des canaux sécurisés pour les alertes',
      'Méfiez-vous des "tests de sécurité" par téléphone'
    ],
    data: {
      call: {
        caller: {
          name: 'Sophie Martin - Service Sécurité Bancaire',
          company: 'Votre Banque',
          number: '+33 1 70 12 34 56',
          spoofed: true
        },
        pretext: 'Nous détectons une tentative de transaction frauduleuse sur votre compte professionnel',
        request: 'Pour confirmer votre identité et bloquer la fraude, j\'ai besoin que vous me donniez le code reçu par SMS et votre mot de passe temporaire',
        pressureTactics: ['urgence extrême', 'risque de perte financière', 'responsabilité personnelle'],
        tone: 'urgent',
        backgroundNoise: false
      },
      redFlags: [
        { type: 'caller', description: 'Numéro ne correspondant pas à celui de la banque', severity: 'high' },
        { type: 'request', description: 'Demande de codes SMS et mots de passe', severity: 'critical' },
        { type: 'pressure', description: 'Pression extrême pour agir immédiatement', severity: 'high' },
        { type: 'method', description: 'Procédure inhabituelle de vérification', severity: 'high' }
      ],
      correctAction: 'decline'
    }
  },
  
  // Scénario Tailgating avancé
  {
    id: 'tailgating-delivery',
    title: 'Livreur pressé',
    description: 'Un livreur prétend avoir une livraison urgente et veut entrer sans autorisation',
    type: 'tailgating',
    difficulty: 'intermediate',
    estimatedTime: 8,
    completionRate: 78,
    biases: ['Preuve sociale', 'Empathie', 'Aide à autrui'],
    tips: [
      'Tous les livreurs doivent être enregistrés à la réception',
      'Ne laissez jamais entrer quelqu\'un sous prétexte d\'urgence',
      'Escortez toujours les visiteurs non autorisés à la réception',
      'Vérifiez l\'identité avec le service réception',
      'Signalez les comportements suspects immédiatement'
    ],
    data: {
      situation: {
        location: 'Entrée secondaire du bâtiment',
        time: 'Heure du déjeuner, peu de passage',
        person: {
          appearance: 'Tenue de livreur, casquette, tablette à la main',
          behavior: 'Semble très pressé, montre sa montre',
          story: 'J\'ai une livraison médicale urgente pour le service R&D, c\'est une matière sensible',
          items: ['Boîte étiquetée "Médical - Urgent"', 'Tablette électronique', 'Aucun badge visible'],
          suspicious: true
        },
        context: 'Vous sortez de l\'ascenseur et rencontrez un livreur qui insiste pour entrer directement au service R&D'
      },
      redFlags: [
        { type: 'appearance', description: 'Aucun badge fournisseur visible', severity: 'high' },
        { type: 'behavior', description: 'Insistance inhabituelle pour éviter la réception', severity: 'high' },
        { type: 'story', description: 'Prétexte de livraison médicale urgente', severity: 'medium' },
        { type: 'timing', description: 'Choisit un moment de faible activité', severity: 'medium' },
        { type: 'request', description: 'Refus de passer par la réception', severity: 'high' }
      ],
      correctAction: 'escort'
    }
  }
  
];