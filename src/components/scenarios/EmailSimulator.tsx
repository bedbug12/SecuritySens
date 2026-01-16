'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Paperclip, 
  AlertTriangle, 
  Clock,
  User,
  ExternalLink,
  Download,
  ChevronRight
} from 'lucide-react';
import { AlertBadge } from '@/components/ui/AlertBadge';
import { ConsequenceDisplay } from '@/components/feedback/ConsequenceDisplay';
import { EmailAttachments, EmailLink } from '@/lib/types';

interface EmailSimulatorProps {
  scenario: {
    [x: string]: any;
    id: string;
    title: string;
    email: {
      from: {
        name: string;
        email: string;
        avatar?: string;
      };
      to: string;
      subject: string;
      body: string;
      attachments?: Array<{
        name: string;
        size: string;
        type: string;
        malicious: boolean;
      }>;
      links?: Array<{
        text: string;
        url: string;
        malicious: boolean;
      }>;
      urgencyLevel: 'low' | 'medium' | 'high';
    };
    redFlags: Array<{
      type: 'sender' | 'subject' | 'body' | 'attachment' | 'link' | 'urgency';
      description: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    correctAction: 'report' | 'delete' | 'ignore' | 'verify';
  };
  onComplete: (score: number, action: string) => void; // Changé ici
}

export function EmailSimulator({ scenario, onComplete }: EmailSimulatorProps) {
  // ... reste du code inchangé ...
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [highlightedElements, setHighlightedElements] = useState<string[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 secondes pour répondre

  useEffect(() => {
    if (timeLeft > 0 && !selectedAction) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !selectedAction) {
      handleAction('timeout');
    }
  }, [timeLeft, selectedAction]);

  const handleAction = (action: string) => {
    setSelectedAction(action);
    
    // Calcul du score
    let calculatedScore = 0;
    
    if (action === scenario.correctAction) {
      calculatedScore = 100;
    } else if (action === 'timeout') {
      calculatedScore = 30;
    } else {
      calculatedScore = 50;
    }
    
    // Bonus pour le temps
    const timeBonus = Math.floor(timeLeft / 3);
    calculatedScore += timeBonus;
    
    setScore(calculatedScore);
    
    // Afficher l'analyse après un délai
    setTimeout(() => {
      setShowAnalysis(true);
      onComplete(calculatedScore, action);
    }, 1500);
  };

  const toggleHighlight = (elementId: string) => {
    if (highlightedElements.includes(elementId)) {
      setHighlightedElements(highlightedElements.filter(id => id !== elementId));
    } else {
      setHighlightedElements([...highlightedElements, elementId]);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch(level) {
      case 'high': return 'text-red-400 bg-red-400/10';
      case 'medium': return 'text-amber-400 bg-amber-400/10';
      case 'low': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Temps restant:</span>
          <span className={`font-mono ${timeLeft < 10 ? 'text-red-400' : 'text-emerald-400'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        
        <AlertBadge 
          type="warning" 
          message="Analysez attentivement cet email" 
          size="sm"
        />
      </div>

      {/* Email Simulation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl"
      >
        {/* Email Header */}
        <div className="bg-gray-950 p-6 border-b border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className={`font-semibold cursor-help ${highlightedElements.includes('sender') ? 'text-red-400 underline' : 'text-white'}`}
                    onClick={() => toggleHighlight('sender')}
                  >
                    {scenario.data.email.from.name}
                  </span>
                  {highlightedElements.includes('sender') && (
                    <AlertBadge type="error" message="Expéditeur suspect" size="sm" />
                  )}
                </div>
                <div className="text-sm text-gray-400">{scenario.data.email.from.email}</div>
              </div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(scenario.data.email.urgencyLevel)}`}>
              {scenario.data.email.urgencyLevel === 'high' ? 'URGENT' :
               scenario.data.email.urgencyLevel === 'medium' ? 'IMPORTANT' : 'NORMAL'}
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-sm text-gray-400 mb-1">À :</div>
            <div className="text-gray-300">{scenario.data.email.to}</div>
          </div>
          
          <div className="mb-2">
            <div className="text-sm text-gray-400 mb-1">Objet :</div>
            <div 
              className={`text-lg font-semibold cursor-help ${highlightedElements.includes('subject') ? 'text-amber-400 underline' : 'text-white'}`}
              onClick={() => toggleHighlight('subject')}
            >
              {scenario.data.email.subject}
            </div>
            {highlightedElements.includes('subject') && (
              <AlertBadge type="warning" message="Objet alarmiste" size="sm" />
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            Aujourd'hui à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Email Body */}
        <div className="p-6">
          <div 
            className="prose prose-invert max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: scenario.data.email.body }}
          />
          
          {/* Links */}
          {scenario.data.email.links && scenario.data.email.links.length > 0 && (
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-3">Liens dans l'email :</div>
              <div className="space-y-2">
                {scenario.data.email.links?.map((link: EmailLink, index:number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => toggleHighlight(`link-${index}`)}
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium">{link.text}</div>
                      <div className="text-xs text-gray-500 truncate">{link.url}</div>
                    </div>
                    {highlightedElements.includes(`link-${index}`) && (
                      <AlertBadge 
                        type={link.malicious ? 'error' : 'security'}
                        message={link.malicious ? 'Lien malveillant' : 'Lien sécurisé'}
                        size="sm"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Attachments */}
          {scenario.data.email.attachments && scenario.data.email.attachments.length > 0 && (
            <div>
              <div className="text-sm text-gray-400 mb-3">Pièces jointes :</div>
              <div className="space-y-2">
                {scenario.data.email.attachments?.map((attachment:EmailAttachments, index:number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => toggleHighlight(`attachment-${index}`)}
                  >
                    <Paperclip className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="font-medium">{attachment.name}</div>
                      <div className="text-xs text-gray-500">{attachment.size} • {attachment.type}</div>
                    </div>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                    {highlightedElements.includes(`attachment-${index}`) && (
                      <AlertBadge 
                        type={attachment.malicious ? 'error' : 'security'}
                        message={attachment.malicious ? 'Fichier dangereux' : 'Fichier sécurisé'}
                        size="sm"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      {!selectedAction && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { 
              id: 'report', 
              label: 'Signaler', 
              description: 'Signaler à l\'équipe sécurité',
              color: 'from-red-600 to-orange-600',
              icon: <AlertTriangle className="w-5 h-5" />
            },
            { 
              id: 'delete', 
              label: 'Supprimer', 
              description: 'Supprimer définitivement',
              color: 'from-amber-600 to-yellow-600',
              icon: <AlertTriangle className="w-5 h-5" />
            },
            { 
              id: 'ignore', 
              label: 'Ignorer', 
              description: 'Laisser dans la boîte',
              color: 'from-gray-600 to-gray-700',
              icon: <ChevronRight className="w-5 h-5" />
            },
            { 
              id: 'verify', 
              label: 'Vérifier', 
              description: 'Contacter l\'expéditeur',
              color: 'from-emerald-600 to-green-600',
              icon: <User className="w-5 h-5" />
            }
          ].map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action.id)}
              className={`p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all bg-gradient-to-br ${action.color} text-white text-left group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold">{action.label}</div>
                <div className="p-2 bg-white/20 rounded-lg">
                  {action.icon}
                </div>
              </div>
              <p className="text-sm opacity-90">{action.description}</p>
              <div className="mt-4 text-xs opacity-75 group-hover:opacity-100 transition-opacity">
                Cliquer pour sélectionner
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Score Display */}
      {selectedAction && score !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center p-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              {score}/100
            </div>
            <div className="text-gray-400 mb-4">Score obtenu</div>
            
            <div className="flex items-center gap-2 mb-6">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                score >= 80 ? 'bg-emerald-400/10 text-emerald-400' :
                score >= 60 ? 'bg-blue-400/10 text-blue-400' :
                'bg-amber-400/10 text-amber-400'
              }`}>
                {score >= 80 ? 'Excellent' : score >= 60 ? 'Bon' : 'À améliorer'}
              </div>
              <div className="text-sm text-gray-500">
                Temps bonus: +{Math.floor(timeLeft / 3)} points
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analysis */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <ConsequenceDisplay
              userAction={selectedAction!}
              correctAction={scenario.correctAction}
              scenarioType="phishing"
            />
            
            {/* Red Flags */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                Signaux d'alerte détectés
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenario.redFlags?.map((flag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      flag.severity === 'high' ? 'border-red-400/30 bg-red-400/5' :
                      flag.severity === 'medium' ? 'border-amber-400/30 bg-amber-400/5' :
                      'border-blue-400/30 bg-blue-400/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        flag.severity === 'high' ? 'bg-red-400/20 text-red-400' :
                        flag.severity === 'medium' ? 'bg-amber-400/20 text-amber-400' :
                        'bg-blue-400/20 text-blue-400'
                      }`}>
                        <AlertTriangle className="w-3 h-3" />
                      </div>
                      <div>
                        <div className="font-medium mb-1">
                          {flag.type === 'sender' && 'Expéditeur suspect'}
                          {flag.type === 'subject' && 'Objet alarmiste'}
                          {flag.type === 'body' && 'Contenu suspect'}
                          {flag.type === 'attachment' && 'Pièce jointe risquée'}
                          {flag.type === 'link' && 'Lien malveillant'}
                          {flag.type === 'urgency' && 'Fausse urgence'}
                        </div>
                        <p className="text-sm text-gray-400">{flag.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Best Practices */}
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-2xl border border-blue-800/30 p-6">
              <h3 className="text-xl font-bold mb-4">✅ Bonnes pratiques</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Vérifiez l'expéditeur</div>
                    <p className="text-sm text-gray-400">
                      Examinez l'adresse email complète, pas seulement le nom affiché
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
                      Les attaquants créent un sentiment d'urgence pour vous faire agir sans réfléchir
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Ne cliquez pas sur les liens</div>
                    <p className="text-sm text-gray-400">
                      Survolez les liens pour voir la vraie URL avant de cliquer
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
                      Utilisez le bouton "Signaler" de votre client email ou contactez votre équipe sécurité
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}