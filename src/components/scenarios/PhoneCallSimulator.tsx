'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  User, 
  Building, 
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Volume2,
  Mic,
  MicOff
} from 'lucide-react';
import { AlertBadge } from '@/components/ui/AlertBadge';
import { ConsequenceDisplay } from '@/components/feedback/ConsequenceDisplay';

interface PhoneCallSimulatorProps {
  scenario: {
    [x: string]: any;
    id: string;
    title: string;
    call: {
      caller: {
        name: string;
        company?: string;
        number: string;
        spoofed: boolean;
      };
      pretext: string;
      request: string;
      pressureTactics: string[];
      tone: 'friendly' | 'urgent' | 'authoritative' | 'helpful';
      backgroundNoise?: boolean;
    };
    redFlags: Array<{
      type: 'caller' | 'request' | 'pressure' | 'tone' | 'credentials';
      description: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    correctAction: 'verify' | 'decline' | 'transfer' | 'report';
  };
  onComplete: (score: number, action: string) => void; // Changé ici
}

export function PhoneCallSimulator({ scenario, onComplete }: PhoneCallSimulatorProps) {
  // ... reste du code inchangé ...
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [callActive, setCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callLog, setCallLog] = useState<string[]>([
    'Appel entrant...',
    'Sonnerie...',
    'Connexion établie'
  ]);

  useEffect(() => {
    if (callActive && !selectedAction) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
        
        // Ajouter des messages au log selon la durée
        if (callDuration === 5) {
          setCallLog(prev => [...prev, 'Caller: ' + scenario.call.pretext]);
        }
        if (callDuration === 10) {
          setCallLog(prev => [...prev, 'Caller: ' + scenario.call.request]);
        }
        if (callDuration === 15) {
          setCallLog(prev => [...prev, 'Caller: "C\'est très urgent, je dois régler ça maintenant."']);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [callActive, callDuration, selectedAction, scenario.call]);

  const handleAction = (action: string) => {
    setSelectedAction(action);
    setCallActive(false);
    
    // Calcul du score
    let calculatedScore = 0;
    
    if (action === scenario.correctAction) {
      calculatedScore = 100;
    } else {
      calculatedScore = 50;
    }
    
    // Bonus pour la durée (plus court = mieux)
    const durationBonus = Math.max(0, 30 - callDuration);
    calculatedScore += durationBonus;
    
    setScore(calculatedScore);
    
    // Afficher l'analyse après un délai
    setTimeout(() => {
      setShowAnalysis(true);
      scenario.onComplete(calculatedScore, action);
    }, 1500);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getToneColor = (tone: string) => {
    switch(tone) {
      case 'urgent': return 'text-red-400 bg-red-400/10';
      case 'authoritative': return 'text-purple-400 bg-purple-400/10';
      case 'helpful': return 'text-emerald-400 bg-emerald-400/10';
      case 'friendly': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Call Interface */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
      >
        {/* Call Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">{scenario.call.caller.name}</div>
              <div className="text-gray-400">{scenario.call.caller.number}</div>
              {scenario.call.caller.company && (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {scenario.call.caller.company}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Durée</div>
            <div className="text-2xl font-mono font-bold text-emerald-400">
              {formatDuration(callDuration)}
            </div>
          </div>
        </div>
        
        {/* Call Log */}
        <div className="mb-8">
          <div className="h-64 bg-gray-950 rounded-xl p-4 overflow-y-auto custom-scrollbar">
            {callLog.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`mb-3 p-3 rounded-lg ${index >= 3 ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-gray-800/50'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {index >= 3 && <User className="w-4 h-4 text-blue-400" />}
                  <span className="text-sm text-gray-400">
                    {index >= 3 ? scenario.call.caller.name : 'Système'}
                  </span>
                </div>
                <p className="text-white">{message}</p>
              </motion.div>
            ))}
            
            {selectedAction && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-lg bg-emerald-900/20 border border-emerald-800/30"
              >
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-gray-400">Vous</span>
                </div>
                <p className="text-white">
                  {selectedAction === 'verify' && 'Je dois vérifier votre identité avant de continuer.'}
                  {selectedAction === 'decline' && 'Désolé, je ne peux pas vous aider. Au revoir.'}
                  {selectedAction === 'transfer' && 'Je vais vous transférer au service concerné.'}
                  {selectedAction === 'report' && 'Je signale cet appel à l\'équipe sécurité.'}
                </p>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Call Controls */}
        {!selectedAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-6"
          >
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full ${isMuted ? 'bg-red-400/20 text-red-400' : 'bg-gray-800 text-gray-400'} hover:opacity-80 transition-all`}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            
            <button
              onClick={() => handleAction('decline')}
              className="p-6 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <Phone className="w-8 h-8 rotate-135" />
            </button>
            
            <button
              onClick={() => handleAction('verify')}
              className="p-4 rounded-full bg-emerald-400/20 text-emerald-400 hover:opacity-80 transition-all"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </motion.div>
        )}
        
        {/* Call Info */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getToneColor(scenario.call.tone)}`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Ton</div>
                <div className="font-medium">
                  {scenario.call.tone === 'urgent' ? 'Urgent' :
                   scenario.call.tone === 'authoritative' ? 'Autoritaire' :
                   scenario.call.tone === 'helpful' ? 'Serviable' : 'Amiable'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Pression</div>
                <div className="font-medium">Élevée</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${scenario.call.caller.spoofed ? 'bg-red-400/10 text-red-400' : 'bg-emerald-400/10 text-emerald-400'}`}>
                {scenario.call.caller.spoofed ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-sm text-gray-400">Numéro</div>
                <div className="font-medium">
                  {scenario.call.caller.spoofed ? 'Usurpé' : 'Authentique'}
                </div>
              </div>
            </div>
          </div>
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
              id: 'verify', 
              label: 'Vérifier', 
              description: 'Demander une preuve d\'identité',
              color: 'from-emerald-600 to-green-600'
            },
            { 
              id: 'decline', 
              label: 'Refuser', 
              description: 'Raccrocher poliment',
              color: 'from-red-600 to-orange-600'
            },
            { 
              id: 'transfer', 
              label: 'Transférer', 
              description: 'Passer au service approprié',
              color: 'from-blue-600 to-cyan-600'
            },
            { 
              id: 'report', 
              label: 'Signaler', 
              description: 'Signaler à la sécurité',
              color: 'from-purple-600 to-pink-600'
            }
          ].map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action.id)}
              className={`p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all bg-gradient-to-br ${action.color} text-white text-left`}
            >
              <div className="text-2xl font-bold mb-2">{action.label}</div>
              <p className="text-sm opacity-90 mb-4">{action.description}</p>
              <div className="text-xs opacity-75">
                Sélectionner cette action
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
            
            <div className="flex items-center gap-4 mb-6">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                score >= 80 ? 'bg-emerald-400/10 text-emerald-400' :
                score >= 60 ? 'bg-blue-400/10 text-blue-400' :
                'bg-amber-400/10 text-amber-400'
              }`}>
                {score >= 80 ? 'Excellent' : score >= 60 ? 'Bon' : 'À améliorer'}
              </div>
              <div className="text-sm text-gray-500">
                Durée: {formatDuration(callDuration)}
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
              scenarioType="vishing"
            />
            
            {/* Red Flags */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                Signaux d'alerte détectés
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenario.redFlags.map((flag, index) => (
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
                          {flag.type === 'caller' && 'Appelant suspect'}
                          {flag.type === 'request' && 'Demande inhabituelle'}
                          {flag.type === 'pressure' && 'Pression excessive'}
                          {flag.type === 'tone' && 'Ton inapproprié'}
                          {flag.type === 'credentials' && 'Demande d\'identifiants'}
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
              <h3 className="text-xl font-bold mb-4">✅ Bonnes pratiques téléphoniques</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Vérifiez toujours l'identité</div>
                    <p className="text-sm text-gray-400">
                      Demandez des informations que seul l'interlocuteur légitime peut connaître
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Ne donnez jamais d'identifiants</div>
                    <p className="text-sm text-gray-400">
                      Les équipes IT légitimes ne demandent jamais vos mots de passe par téléphone
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Utilisez les canaux officiels</div>
                    <p className="text-sm text-gray-400">
                      Rappelez via le numéro officiel de l'entreprise pour vérifier l'appel
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Signalez les appels suspects</div>
                    <p className="text-sm text-gray-400">
                      Informez votre équipe sécurité de tout appel inhabituel
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