'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  CheckCircle, 
  XCircle,
  Clock,
  Target,
  AlertTriangle,
  Filter,
  Search,
  Star,
  Trash2,
  Shield,
  User
} from 'lucide-react';
import { AlertBadge } from '@/components/ui/AlertBadge';

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  flagged: boolean;
  category: 'work' | 'social' | 'promotion' | 'security';
  legitimacy: 'legitimate' | 'phishing' | 'suspicious';
  redFlags?: string[];
}

interface MailInboxSimulatorProps {
  onAnswer: (isCorrect: boolean) => void;
}

export function MailInboxSimulator({ onAnswer }: MailInboxSimulatorProps) {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      from: 'Jean Dupont',
      fromEmail: 'jean.dupont@entreprise.com',
      subject: 'Réunion équipe - Demain 10h',
      preview: 'Bonjour, la réunion d\'équipe est confirmée pour demain à 10h en salle B12...',
      time: '09:30',
      read: true,
      flagged: false,
      category: 'work',
      legitimacy: 'legitimate'
    },
    {
      id: '2',
      from: 'Support IT',
      fromEmail: 'support-it@yourcompany-solution.com',
      subject: 'URGENT : Votre compte va expirer',
      preview: 'Cher employé, votre compte va expirer dans 24h. Cliquez ici pour le renouveler...',
      time: '11:45',
      read: false,
      flagged: false,
      category: 'security',
      legitimacy: 'phishing',
      redFlags: ['Domaine légèrement différent', 'Urgence artificielle', 'Demande de clic']
    },
    {
      id: '3',
      from: 'LinkedIn',
      fromEmail: 'updates-noreply@linkedin.com',
      subject: 'Vous avez 3 nouvelles connexions',
      preview: 'Découvrez qui a consulté votre profil cette semaine...',
      time: 'Hier',
      read: true,
      flagged: false,
      category: 'social',
      legitimacy: 'legitimate'
    },
    {
      id: '4',
      from: 'PDG',
      fromEmail: 'ceo@company-security.com',
      subject: 'Virement urgent requis',
      preview: 'Je suis en déplacement, besoin d\'un virement immédiat de 25 000€...',
      time: '14:20',
      read: false,
      flagged: false,
      category: 'security',
      legitimacy: 'phishing',
      redFlags: ['Adresse email suspecte', 'Demande financière par email', 'Urgence']
    },
    {
      id: '5',
      from: 'Amazon',
      fromEmail: 'order-update@amazon.com',
      subject: 'Confirmation de votre commande',
      preview: 'Votre commande #12345 a été expédiée...',
      time: 'Hier',
      read: true,
      flagged: false,
      category: 'promotion',
      legitimacy: 'legitimate'
    },
    {
      id: '6',
      from: 'RH Entreprise',
      fromEmail: 'rh@your-company.fr',
      subject: 'Formation sécurité obligatoire',
      preview: 'Participation requise à la formation sécurité du mois prochain...',
      time: '10:15',
      read: false,
      flagged: false,
      category: 'work',
      legitimacy: 'legitimate'
    },
    {
      id: '7',
      from: 'Netflix',
      fromEmail: 'info@netflix-update.com',
      subject: 'Problème avec votre paiement',
      preview: 'Votre abonnement a été suspendu. Mettez à jour vos informations de paiement...',
      time: '13:30',
      read: false,
      flagged: false,
      category: 'security',
      legitimacy: 'suspicious',
      redFlags: ['Lien vers un domaine non officiel', 'Demande d\'informations de paiement']
    },
    {
      id: '8',
      from: 'Microsoft Teams',
      fromEmail: 'teams-noreply@microsoft.com',
      subject: 'Nouveau message dans l\'équipe Projet',
      preview: 'Vous avez reçu un nouveau message dans le canal #général...',
      time: '08:45',
      read: true,
      flagged: false,
      category: 'work',
      legitimacy: 'legitimate'
    }
  ]);

  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [gameComplete, setGameComplete] = useState(false);
  const [filter, setFilter] = useState<'all' | 'phishing' | 'legitimate'>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameComplete) {
      handleSubmit();
    }
  }, [timeLeft, gameComplete]);

  const toggleEmail = (emailId: string) => {
    if (selectedEmails.includes(emailId)) {
      setSelectedEmails(selectedEmails.filter(id => id !== emailId));
    } else {
      setSelectedEmails([...selectedEmails, emailId]);
    }
  };

  const handleSubmit = () => {
    if (selectedEmails.length === 0) return;
    
    // Calcul du score
    let calculatedScore = 0;
    let correctSelections = 0;
    let incorrectSelections = 0;
    
    selectedEmails.forEach(emailId => {
      const email = emails.find(e => e.id === emailId);
      if (email) {
        if (email.legitimacy === 'phishing') {
          correctSelections++;
          calculatedScore += 15;
        } else {
          incorrectSelections++;
          calculatedScore -= 10;
        }
      }
    });
    
    // Emails de phishing manqués
    const phishingEmails = emails.filter(e => e.legitimacy === 'phishing');
    const missedPhishing = phishingEmails.filter(e => !selectedEmails.includes(e.id));
    calculatedScore -= missedPhishing.length * 20;
    
    // Bonus temps
    const timeBonus = Math.floor(timeLeft / 6);
    calculatedScore += timeBonus;
    
    calculatedScore = Math.max(0, calculatedScore);
    
    setScore(calculatedScore);
    onAnswer(calculatedScore > 0);
    setGameComplete(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'work': return 'text-blue-400 bg-blue-400/10';
      case 'security': return 'text-red-400 bg-red-400/10';
      case 'social': return 'text-purple-400 bg-purple-400/10';
      case 'promotion': return 'text-amber-400 bg-amber-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getLegitimacyColor = (legitimacy: string) => {
    switch(legitimacy) {
      case 'legitimate': return 'text-emerald-400 bg-emerald-400/10';
      case 'phishing': return 'text-red-400 bg-red-400/10';
      case 'suspicious': return 'text-amber-400 bg-amber-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const filteredEmails = emails.filter(email => {
    if (filter === 'all') return true;
    if (filter === 'phishing') return email.legitimacy === 'phishing';
    if (filter === 'legitimate') return email.legitimacy !== 'phishing';
    return true;
  });

  if (gameComplete) {
    const phishingCount = emails.filter(e => e.legitimacy === 'phishing').length;
    const detectedCount = selectedEmails.filter(id => {
      const email = emails.find(e => e.id === id);
      return email?.legitimacy === 'phishing';
    }).length;
    
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Analyse terminée !
          </div>
          <p className="text-xl text-gray-400 mb-8">
            Score final : {score} points
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {detectedCount}/{phishingCount}
            </div>
            <div className="text-gray-400">Phishing détectés</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {formatTime(180 - timeLeft)}
            </div>
            <div className="text-gray-400">Temps utilisé</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {Math.floor(timeLeft / 6)}
            </div>
            <div className="text-gray-400">Bonus temps</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-xl font-bold mb-6">📊 Analyse de votre performance</h3>
          
          <div className="space-y-4">
            {emails.map(email => {
              const isSelected = selectedEmails.includes(email.id);
              const isPhishing = email.legitimacy === 'phishing';
              
              return (
                <div
                  key={email.id}
                  className={`p-4 rounded-xl border ${
                    isSelected
                      ? isPhishing
                        ? 'border-emerald-400/50 bg-emerald-400/5'
                        : 'border-red-400/50 bg-red-400/5'
                      : 'border-gray-700 bg-gray-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isPhishing ? 'bg-red-400/20' : 'bg-emerald-400/20'
                      }`}>
                        {isPhishing ? (
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-400"/>
                                                  )}
                      </div>
                      <div>
                        <div className="font-medium">{email.from}</div>
                        <div className="text-sm text-gray-400">{email.subject}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getLegitimacyColor(email.legitimacy)
                      }`}>
                        {email.legitimacy === 'phishing' ? 'Phishing' : 
                         email.legitimacy === 'suspicious' ? 'Suspect' : 'Légitime'}
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        {isSelected ? (
                          isPhishing ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Correctement identifié
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              Faux positif
                            </span>
                          )
                        ) : isPhishing ? (
                          <span className="text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            Manqué
                          </span>
                        ) : (
                          <span className="text-gray-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Correctement ignoré
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {email.redFlags && (
                    <div className="mt-3 pl-11">
                      <div className="text-sm text-gray-400 mb-2">🚩 Drapeaux rouges :</div>
                      <div className="flex flex-wrap gap-2">
                        {email.redFlags.map((flag, index) => (
                          <span key={index} className="px-2 py-1 bg-red-400/10 text-red-300 text-xs rounded">
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-2xl border border-blue-800/30 p-6">
          <h3 className="text-xl font-bold mb-4">📧 Conseils de sécurité email</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <div className="font-medium">Vérifiez l'adresse de l'expéditeur</div>
                <p className="text-sm text-gray-400">
                  Regardez attentivement le domaine (ex: @entreprise.com vs @entreprise-solution.com)
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <div className="font-medium">Méfiez-vous des urgences</div>
                <p className="text-sm text-gray-400">
                  Les cybercriminels créent souvent un sentiment d'urgence pour vous faire agir sans réfléchir
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <div className="font-medium">Survolez les liens avant de cliquer</div>
                <p className="text-sm text-gray-400">
                  Passez votre souris sur les liens pour voir la vraie URL sans cliquer
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <div className="font-medium">Signalez les emails suspects</div>
                <p className="text-sm text-gray-400">
                  Utilisez le bouton "Signaler le phishing" dans votre client email
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-400" />
              Détection de Phishing
            </h2>
            <p className="text-gray-400">
              Identifiez les emails de phishing dans votre boîte de réception
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">Temps restant</div>
              <div className="text-2xl font-bold text-amber-400">{formatTime(timeLeft)}</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">Sélectionnés</div>
              <div className="text-2xl font-bold text-emerald-400">
                {selectedEmails.length}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">Score actuel</div>
              <div className="text-2xl font-bold text-purple-400">{score}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-xl border border-blue-800/30 p-4">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-blue-400" />
          <div className="text-sm">
            <span className="font-bold text-white">Objectif :</span> Sélectionnez tous les emails de phishing. 
            <span className="text-amber-400 ml-2">
              +15 points pour chaque phishing détecté, -10 points pour chaque faux positif
            </span>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden">
        {/* Email Header */}
        <div className="border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={selectedEmails.length === 0}
                className={`px-6 py-2 rounded-lg font-medium ${
                  selectedEmails.length === 0
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:opacity-90'
                }`}
              >
                Analyser la sélection ({selectedEmails.length})
              </button>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm"
                >
                  <option value="all">Tous les emails</option>
                  <option value="phishing">Phishing uniquement</option>
                  <option value="legitimate">Légitimes uniquement</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                {filteredEmails.length} emails
              </div>
              <Search className="w-5 h-5 text-gray-400 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
          {filteredEmails.map((email) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => toggleEmail(email.id)}
              className={`p-4 cursor-pointer transition-all hover:bg-gray-800/30 ${
                selectedEmails.includes(email.id)
                  ? email.legitimacy === 'phishing'
                    ? 'bg-emerald-400/5 border-l-4 border-emerald-400'
                    : 'bg-red-400/5 border-l-4 border-red-400'
                  : 'bg-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  selectedEmails.includes(email.id)
                    ? email.legitimacy === 'phishing'
                      ? 'bg-emerald-400 border-emerald-400'
                      : 'bg-red-400 border-red-400'
                    : 'border-gray-600'
                }`}>
                  {selectedEmails.includes(email.id) && (
                    email.legitimacy === 'phishing' ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <XCircle className="w-4 h-4 text-white" />
                    )
                  )}
                </div>

                {/* Star */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle star
                  }}
                  className="text-gray-400 hover:text-amber-400"
                >
                  <Star className={`w-4 h-4 ${email.flagged ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>

                {/* Sender */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">{email.from}</div>
                    <span className="text-xs text-gray-400 truncate">{email.fromEmail}</span>
                  </div>
                  <div className="text-sm font-medium truncate">{email.subject}</div>
                  <div className="text-sm text-gray-400 truncate">{email.preview}</div>
                </div>

                {/* Time & Indicators */}
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-400">{email.time}</div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getCategoryColor(email.category)
                  }`}>
                    {email.category === 'work' && 'Travail'}
                    {email.category === 'security' && 'Sécurité'}
                    {email.category === 'social' && 'Social'}
                    {email.category === 'promotion' && 'Promotion'}
                  </div>
                  
                  {email.legitimacy === 'phishing' && (
                    <AlertBadge 
                      type="warning"
                      message="Potentiel phishing"
                      size="sm"
                    />
                  )}
                  
                  {!email.read && (
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  )}
                </div>
              </div>
              
              {/* Red Flags Preview */}
              {email.redFlags && (
                <div className="mt-3 ml-12">
                  <div className="flex flex-wrap gap-2">
                    {email.redFlags.slice(0, 2).map((flag, index) => (
                      <span key={index} className="px-2 py-1 bg-red-400/10 text-red-300 text-xs rounded">
                        {flag}
                      </span>
                    ))}
                    {email.redFlags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                        +{email.redFlags.length - 2} autres
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-900/50 rounded-xl p-4">
        <div className="text-sm text-gray-400 mb-3">Légende :</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-emerald-400/20 border border-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-sm">Phishing correctement identifié</div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-red-400/20 border border-red-400 flex items-center justify-center">
              <XCircle className="w-3 h-3 text-red-400" />
            </div>
            <div className="text-sm">Email légitime marqué par erreur</div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-amber-400/20 border border-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-sm">Phishing manqué</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <div className="font-bold">Signes d'un email de phishing</div>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
              <span>Adresse email de l'expéditeur suspecte</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
              <span>Fautes d'orthographe et de grammaire</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
              <span>Sentiment d'urgence artificiel</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>
              <span>Demande d'informations confidentielles</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-emerald-400" />
            <div className="font-bold">Bonnes pratiques</div>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
              <span>Vérifiez toujours l'adresse complète de l'expéditeur</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
              <span>Ne cliquez jamais sur des liens suspects</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
              <span>Contactez l'expéditeur par un autre canal pour vérifier</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
              <span>Signalez immédiatement tout email suspect</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}