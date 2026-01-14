'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Building, 
  DoorOpen, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Camera,
  Badge,
  Clock
} from 'lucide-react';
import { AlertBadge } from '@/components/ui/AlertBadge';
import { ConsequenceDisplay } from '@/components/feedback/ConsequenceDisplay';

interface OfficeScenarioProps {
  scenario: {
    [x: string]: any;
    id: string;
    title: string;
    situation: {
      location: string;
      time: string;
      person: {
        appearance: string;
        behavior: string;
        story: string;
        items: string[];
        suspicious: boolean;
      };
      context: string;
    };
    redFlags: Array<{
      type: 'appearance' | 'behavior' | 'story' | 'items' | 'timing';
      description: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    correctAction: 'allow' | 'deny' | 'escort' | 'verify';
  };
  onComplete: (score: number, action: string) => void; // Changé ici
}

export function OfficeScenario({ scenario, onComplete }: OfficeScenarioProps) {
  // ... reste du code inchangé ...
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [observations, setObservations] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedAction) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [selectedAction]);

  const handleObservation = (observation: string) => {
    if (!observations.includes(observation)) {
      setObservations([...observations, observation]);
    }
  };

  const handleAction = (action: string) => {
    setSelectedAction(action);
    
    // Calcul du score
    let calculatedScore = 0;
    
    if (action === scenario.correctAction) {
      calculatedScore = 100;
    } else {
      calculatedScore = 50;
    }
    
    // Bonus pour les observations
    const observationBonus = observations.length * 10;
    calculatedScore += observationBonus;
    
    // Bonus pour le temps (plus de temps = mieux)
    const timeBonus = Math.min(30, Math.floor(timeSpent / 5));
    calculatedScore += timeBonus;
    
    setScore(calculatedScore);
    
    // Afficher l'analyse après un délai
    setTimeout(() => {
      setShowAnalysis(true);
      scenario.onComplete(calculatedScore, action);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isSuspiciousItem = (item: string) => {
    const suspiciousItems = ['aucun badge', 'pas de badge visible', 'badge caché', 'sans identification'];
    return suspiciousItems.some(suspicious => item.toLowerCase().includes(suspicious));
  };

  return (
    <div className="space-y-6">
      {/* Scenario Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{scenario.title}</h2>
            <p className="text-gray-400">{scenario.situation.context}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">{scenario.situation.time}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Location */}
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Building className="w-5 h-5 text-blue-400" />
              <div className="font-medium">Lieu</div>
            </div>
            <p className="text-gray-300">{scenario.situation.location}</p>
          </div>
          
          {/* Person Description */}
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-purple-400" />
              <div className="font-medium">Description</div>
            </div>
            <p className="text-gray-300">{scenario.situation.person.appearance}</p>
          </div>
          
          {/* Behavior */}
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div className="font-medium">Comportement</div>
            </div>
            <p className="text-gray-300">{scenario.situation.person.behavior}</p>
          </div>
        </div>
      </motion.div>

      {/* Interactive Scene */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Scene */}
          <div className="flex-1">
            <div className="relative bg-gray-950 rounded-xl p-6 min-h-[400px]">
              {/* Office door */}
              <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2">
                <div className="w-48 h-72 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border-4 border-gray-700 flex flex-col items-center justify-center">
                  <DoorOpen className="w-16 h-16 text-gray-600 mb-4" />
                  <div className="text-gray-500 text-sm">Entrée principale</div>
                  <div className="absolute top-4 right-4">
                    <Camera className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                
                {/* Person */}
                <motion.div
                  animate={{ 
                    x: [0, 10, 0, -10, 0],
                    y: [0, -5, 0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -right-32 top-1/2 transform -translate-y-1/2"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Speech bubble */}
                  <div className="absolute -top-16 -left-32 bg-gray-800 rounded-xl p-4 border border-gray-700 max-w-xs">
                    <p className="text-sm text-white">{scenario.situation.person.story}</p>
                    <div className="absolute bottom-0 left-1/2 transform translate-x-6 translate-y-1/2 rotate-45 w-4 h-4 bg-gray-800 border-r border-b border-gray-700" />
                  </div>
                </motion.div>
              </div>
              
              {/* Security indicators */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <div className="p-2 bg-red-400/10 rounded-lg">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <div className="p-2 bg-amber-400/10 rounded-lg">
                  <Camera className="w-5 h-5 text-amber-400" />
                </div>
                <div className="p-2 bg-blue-400/10 rounded-lg">
                  <Badge className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Observations */}
          <div className="lg:w-1/3">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              Observations
            </h3>
            
            <div className="space-y-4 mb-8">
              {scenario.situation.person.items.map((item, index) => {
                const suspicious = isSuspiciousItem(item);
                const isObserved = observations.includes(`item-${index}`);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isObserved
                        ? suspicious
                          ? 'border-red-400/50 bg-red-400/5'
                          : 'border-emerald-400/50 bg-emerald-400/5'
                        : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                    }`}
                    onClick={() => handleObservation(`item-${index}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          suspicious ? 'bg-red-400/20' : 'bg-blue-400/20'
                        }`}>
                          {suspicious ? (
                            <XCircle className="w-4 h-4 text-red-400" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <span className={suspicious && isObserved ? 'text-red-300' : 'text-gray-300'}>
                          {item}
                        </span>
                      </div>
                      
                      {isObserved && (
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          suspicious
                            ? 'bg-red-400/20 text-red-400'
                            : 'bg-emerald-400/20 text-emerald-400'
                        }`}>
                          {suspicious ? 'Suspect' : 'Normal'}
                        </div>
                      )}
                    </div>
                    
                    {isObserved && suspicious && (
                      <p className="text-sm text-red-400 mt-2">
                        Ceci est un signal d'alerte : absence d'identification officielle
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Observations notées</div>
              <div className="text-3xl font-bold text-emerald-400">
                {observations.length}/{scenario.situation.person.items.length}
              </div>
            </div>
          </div>
        </div>
        
        {/* Timer */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center gap-4">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Temps passé à observer :</span>
            <span className="font-mono text-lg text-emerald-400">{formatTime(timeSpent)}</span>
            <AlertBadge 
              type="info" 
              message={`+${Math.min(30, Math.floor(timeSpent / 5))} points bonus`}
              size="sm"
            />
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
              id: 'allow', 
              label: 'Autoriser', 
              description: 'Laisser entrer sans escorte',
              color: 'from-emerald-600 to-green-600',
              icon: <CheckCircle className="w-6 h-6" />
            },
            { 
              id: 'deny', 
              label: 'Refuser', 
              description: 'Interdire l\'accès',
              color: 'from-red-600 to-orange-600',
              icon: <XCircle className="w-6 h-6" />
            },
            { 
              id: 'escort', 
              label: 'Escorter', 
              description: 'Accompagner à la réception',
              color: 'from-blue-600 to-cyan-600',
              icon: <User className="w-6 h-6" />
            },
            { 
              id: 'verify', 
              label: 'Vérifier', 
              description: 'Contacter la sécurité',
              color: 'from-purple-600 to-pink-600',
              icon: <Shield className="w-6 h-6" />
            }
          ].map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action.id)}
              className={`p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all bg-gradient-to-br ${action.color} text-white text-left`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold">{action.label}</div>
                {action.icon}
              </div>
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
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Observations</div>
                <div className="text-xl font-bold text-emerald-400">
                  +{observations.length * 10}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Temps</div>
                <div className="text-xl font-bold text-blue-400">
                  +{Math.min(30, Math.floor(timeSpent / 5))}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Action</div>
                <div className="text-xl font-bold text-purple-400">
                  {selectedAction === scenario.correctAction ? '+100' : '+50'}
                </div>
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
              scenarioType="tailgating"
            />
            
            {/* Security Guidelines */}
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-2xl border border-blue-800/30 p-6">
              <h3 className="text-xl font-bold mb-4">🏢 Procédures de sécurité physique</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Vérifiez toujours les badges</div>
                    <p className="text-sm text-gray-400">
                      Un badge d'entreprise visible doit être porté en permanence dans les locaux
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Ne tailgatez pas</div>
                    <p className="text-sm text-gray-400">
                      Chaque personne doit utiliser son propre badge pour entrer
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Escortez les visiteurs</div>
                    <p className="text-sm text-gray-400">
                      Les visiteurs doivent être accompagnés en permanence
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Signalez les intrusions</div>
                    <p className="text-sm text-gray-400">
                      Informez immédiatement la sécurité de toute personne suspecte
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