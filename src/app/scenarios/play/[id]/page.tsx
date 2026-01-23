'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  AlertTriangle,
  Shield,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle
} from 'lucide-react';
import { scenarios } from '@/lib/data/scenarios';
import { EmailSimulator } from '@/components/scenarios/EmailSimulator';
import { PhoneCallSimulator } from '@/components/scenarios/PhoneCallSimulator';
import { OfficeScenario } from '@/components/scenarios/OfficeScenario';
import { QRCodeScanner } from '@/components/scenarios/QRCodeScanner';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { useNotification } from '@/components/feedback/NotificationProvider';
import { CyberButton } from '@/components/ui/CyberButton';
import { useSession } from 'next-auth/react';

export default function PlayScenarioPage() {
  const params = useParams();
  const router = useRouter();
  const { showNotification } = useNotification();
  const { data: session } = useSession();
  
  const [scenario, setScenario] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const loadScenario = () => {
      setIsLoading(true);
      const found = scenarios.find(s => s.id === params.id);
      
      if (found) {
        setScenario(found);
        showNotification(`Scénario démarré: ${found.title}`, 'info');
      } else {
        showNotification('Scénario non trouvé', 'error');
        router.push('/scenarios');
      }
      setIsLoading(false);
    };

    loadScenario();
  }, [params.id, router, showNotification]);

  useEffect(() => {
    if (!isComplete && scenario) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isComplete, scenario]);

  // Dans la fonction handleScenarioComplete, remplacez le code actuel par :

const handleScenarioComplete = async (scenarioScore: number) => {
  setScore(scenarioScore);
  setIsComplete(true);
  
  if (scenario) {
    try {
      // Enregistrer le score via l'API - SEULE SOURCE DE VÉRITÉ
      const response = await fetch('/api/user/scenario-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenarioId: scenario.id,
          score: scenarioScore,
          timeSpent: timer,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save scenario score');
      }

      const result = await response.json();
      
      // Mettre à jour la progression locale AVEC LA RÉPONSE SERVEUR
      if (result.progress) {
        // Vous pouvez utiliser un contexte global ou rafraîchir les données
        // Pour l'instant, on montre juste le résultat
        console.log('Progression mise à jour:', result.progress);
      }

      // Notification
      if (scenarioScore >= 80) {
        showNotification('🎉 Excellent travail ! Score élevé', 'success');
      } else if (scenarioScore >= 60) {
        showNotification('👍 Bon travail, continuez comme ça !', 'info');
      } else {
        showNotification('💡 Analysez les conseils pour améliorer votre score', 'warning');
      }

      // Afficher les badges débloqués
      if (result.badgesUnlocked?.length > 0) {
        showNotification(
          `🎖️ Nouveaux badges débloqués : ${result.badgesUnlocked.join(', ')}`,
          'success',
          '+XP: ' + result.xpGained
        );
      }

    } catch (error) {
      console.error('Error saving scenario score:', error);
      showNotification(
        'Erreur lors de la sauvegarde de votre progression',
        'error'
      );
      
      // Mode invité : sauvegarde locale
      if (!session?.user) {
        try {
          const guestProgress = localStorage.getItem('security-sense-progress-guest');
          if (guestProgress) {
            const parsed = JSON.parse(guestProgress);
            const updatedProgress = {
              ...parsed,
              xp: parsed.xp + Math.round(scenarioScore / 10),
              vigilanceScore: Math.min(100, Math.max(0,
                Math.round((parsed.vigilanceScore * 0.7) + (scenarioScore * 0.3))
              )),
              completedScenarios: [...new Set([...parsed.completedScenarios, scenario.id])],
              lastPlayed: new Date().toISOString(),
            };
            localStorage.setItem('security-sense-progress-guest', JSON.stringify(updatedProgress));
          }
        } catch (localError) {
          console.error('Error saving to localStorage:', localError);
        }
      }
    }
  }
};

// Supprimez l'appel à completeScenario du contexte qui fait des calculs locaux
// REMOVE: await completeScenario(scenario.id, scenarioScore);

  const handleNext = () => {
    if (scenario && currentStep < scenario.data?.steps?.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Page de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Chargement de la simulation...</p>
        </div>
      </div>
    );
  }

  // Page d'erreur si scénario non trouvé
  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Scénario non trouvé</h2>
          <p className="text-gray-400 mb-8">
            Le scénario que vous cherchez n'existe pas ou a été déplacé.
          </p>
          <CyberButton
            variant="primary"
            onClick={() => router.push('/scenarios')}
          >
            Retour aux scénarios
          </CyberButton>
        </div>
      </div>
    );
  }

  const renderScenario = () => {
    if (!scenario) return null;
    
    switch(scenario.type) {
      case 'phishing':
        return <EmailSimulator scenario={scenario} onComplete={handleScenarioComplete} />;
      case 'vishing':
        return <PhoneCallSimulator scenario={scenario} onComplete={handleScenarioComplete} />;
      case 'tailgating':
        return <OfficeScenario scenario={scenario} onComplete={handleScenarioComplete} />;
      case 'qr':
        return <QRCodeScanner scenario={scenario} onComplete={handleScenarioComplete} />;
      default:
        return (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <p className="text-gray-400">Type de scénario non supporté</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push(`/scenarios/${scenario.id}`)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au scénario
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 rounded-lg border border-gray-800">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-sm">{formatTime(timer)}</span>
            </div>
            
            <button
              onClick={() => setShowHint(!showHint)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Afficher un indice"
            >
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Indice */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-900/20 to-blue-700/20 rounded-xl p-4 border border-blue-700/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Indice de sécurité</h4>
                    <p className="text-sm text-gray-300">
                      {scenario.type === 'phishing' && 'Vérifiez toujours l\'adresse email complète et méfiez-vous des demandes urgentes.'}
                      {scenario.type === 'vishing' && 'Les équipes IT ne demandent jamais vos identifiants par téléphone. Vérifiez via les canaux officiels.'}
                      {scenario.type === 'tailgating' && 'Ne laissez jamais entrer quelqu\'un sans badge visible. Demandez systématiquement son identité.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scénario */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gray-900/50 border border-gray-800">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {scenario.title}
                </h1>
                <p className="text-gray-400">
                  Prenez les bonnes décisions pour sécuriser votre entreprise
                </p>
              </div>
            </div>
          </motion.div>

          {renderScenario()}
        </div>

        {/* Résultats */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8 max-w-2xl w-full"
              >
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    score >= 80 ? 'bg-emerald-400/20' :
                    score >= 60 ? 'bg-blue-400/20' :
                    'bg-amber-400/20'
                  }`}>
                    {score >= 80 ? (
                      <CheckCircle className="w-12 h-12 text-emerald-400" />
                    ) : score >= 60 ? (
                      <Shield className="w-12 h-12 text-blue-400" />
                    ) : (
                      <AlertTriangle className="w-12 h-12 text-amber-400" />
                    )}
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-4">
                    {score >= 80 ? 'Excellent travail !' :
                     score >= 60 ? 'Bon travail !' :
                     'Bonne tentative !'}
                  </h2>
                  
                  <p className="text-gray-400 mb-8">
                    {score >= 80 ? 'Vous avez démontré une excellente vigilance.' :
                     score >= 60 ? 'Vous avez les bases, continuez à vous entraîner.' :
                     'Analysez les conseils pour améliorer vos réflexes.'}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {score}
                    </div>
                    <div className="text-sm text-gray-400">Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {formatTime(timer)}
                    </div>
                    <div className="text-sm text-gray-400">Temps</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">
                      +{Math.round(score / 10)} XP
                    </div>
                    <div className="text-sm text-gray-400">Expérience</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <CyberButton
                    variant="outline"
                    onClick={() => router.push('/scenarios')}
                    className="flex-1"
                  >
                    Voir tous les scénarios
                  </CyberButton>
                  
                  <CyberButton
                    variant="primary"
                    onClick={() => {
                      setIsComplete(false);
                      setScore(0);
                      setTimer(0);
                      setCurrentStep(0);
                    }}
                    className="flex-1"
                  >
                    Rejouer ce scénario
                  </CyberButton>
                  
                  <CyberButton
                    variant="ghost"
                    onClick={() => router.push('/progress')}
                    className="flex-1"
                  >
                    Voir ma progression
                  </CyberButton>
                </div>

                {/* Conseils */}
                {scenario.tips && (
                  <div className="mt-8 pt-8 border-t border-gray-800">
                    <h3 className="text-lg font-bold mb-4 text-center">
                      Conseils pour améliorer votre score
                    </h3>
                    <ul className="space-y-2">
                      {scenario.tips.slice(0, 3).map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="text-emerald-400 mt-1">✓</div>
                          <span className="text-sm text-gray-300">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}