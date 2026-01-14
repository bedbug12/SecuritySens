'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Clock,
  AlertTriangle,
  Shield,
  Target,
  BookOpen,
  Play
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { scenarios } from '@/lib/data/scenarios';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { useNotification } from '@/components/feedback/NotificationProvider';

export default function ScenarioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userProgress, completeScenario } = useProgress();
  const { showNotification } = useNotification();
  
  const [scenario, setScenario] = useState<any>(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const found = scenarios.find(s => s.id === params.id);
    if (found) {
      setScenario(found);
    } else {
      router.push('/scenarios');
    }
  }, [params.id, router]);

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Chargement du scénario...</p>
        </div>
      </div>
    );
  }

  const isCompleted = userProgress.completedScenarios.includes(scenario.id);
  const completionRate = scenario.completionRate || 65;

  const handleStart = () => {
    setIsStarting(true);
    showNotification(`Démarrage du scénario: ${scenario.title}`, 'info');
    
    // Simulation de chargement
    setTimeout(() => {
      router.push(`/scenarios/play/${scenario.id}`);
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
      case 'intermediate': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
      case 'advanced': return 'bg-red-400/10 text-red-400 border-red-400/20';
      default: return 'bg-gray-400/10 text-gray-400 border-gray-400/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'phishing': return '📧';
      case 'vishing': return '📞';
      case 'pretexting': return '🎭';
      case 'tailgating': return '🚪';
      case 'qr': return '📱';
      default: return '🛡️';
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/scenarios')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux scénarios
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* En-tête */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{getTypeIcon(scenario.type)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(scenario.difficulty)}`}>
                      {scenario.difficulty === 'beginner' ? 'Débutant' :
                       scenario.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                    </span>
                    {isCompleted && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                        Terminé ✓
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {scenario.title}
                  </h1>
                  
                  <p className="text-xl text-gray-300 mb-6">
                    {scenario.description}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <div className="text-sm text-gray-400">Durée</div>
                  </div>
                  <div className="text-2xl font-bold">
                    {scenario.estimatedTime}min
                  </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <div className="text-sm text-gray-400">Taux de réussite</div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {completionRate}%
                  </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <div className="text-sm text-gray-400">Complexité</div>
                  </div>
                  <div className="text-2xl font-bold">
                    {scenario.difficulty === 'beginner' ? 'Faible' :
                     scenario.difficulty === 'intermediate' ? 'Moyenne' : 'Élevée'}
                  </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <div className="text-sm text-gray-400">Impact</div>
                  </div>
                  <div className="text-2xl font-bold text-amber-400">
                    {scenario.difficulty === 'beginner' ? 'Faible' :
                     scenario.difficulty === 'intermediate' ? 'Moyen' : 'Critique'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Objectifs d'apprentissage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-400" />
                Objectifs d'apprentissage
              </h2>
              
              <ul className="space-y-4">
                {scenario.tips.map((tip: string, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    </div>
                    <span className="text-gray-300">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Description détaillée */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-4">À propos de ce scénario</h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Ce scénario simule une situation réelle que vous pourriez rencontrer dans votre environnement professionnel.
                  Vous serez mis en situation et devrez prendre des décisions qui auront des conséquences sur l'issue de l'attaque.
                </p>
                
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 my-6">
                  <h3 className="text-lg font-semibold mb-3 text-amber-400">
                    ⚠️ Ce que vous allez expérimenter :
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      </div>
                      <span>Une interface réaliste simulant votre environnement de travail</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      </div>
                      <span>Des choix multiples avec des conséquences différentes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      </div>
                      <span>Un feedback détaillé sur vos décisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      </div>
                      <span>Des conseils pratiques pour améliorer votre vigilance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-900/20 to-emerald-900/20 rounded-2xl border border-blue-700/30 p-8"
            >
              <h3 className="text-xl font-bold mb-4">Prêt à commencer ?</h3>
              <p className="text-gray-300 mb-6 text-sm">
                Ce scénario vous prendra environ {scenario.estimatedTime} minutes.
                Vous recevrez un score et des conseils personnalisés à la fin.
              </p>
              
              <CyberButton
                variant="primary"
                onClick={handleStart}
                disabled={isStarting}
                icon={isStarting ? null : <Play className="w-5 h-5" />}
                className="w-full justify-center mb-4"
              >
                {isStarting ? 'Préparation...' : 'Démarrer le scénario'}
              </CyberButton>
              
              {isStarting && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Chargement de la simulation...</p>
                </div>
              )}
              
              {isCompleted && (
                <div className="mt-4 p-3 bg-emerald-400/10 rounded-lg border border-emerald-400/20">
                  <p className="text-sm text-emerald-400 text-center">
                    ✓ Vous avez déjà complété ce scénario
                  </p>
                </div>
              )}
            </motion.div>

            {/* Biais cognitifs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6"
            >
              <h3 className="text-lg font-bold mb-4">Biais cognitifs exploités</h3>
              <div className="space-y-3">
                {scenario.biases.map((bias: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{bias}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Ce biais vous pousse à prendre des décisions irrationnelles sous pression
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Progression */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6"
            >
              <h3 className="text-lg font-bold mb-4">Votre progression</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Scénarios complétés</span>
                    <span className="text-emerald-400">
                      {userProgress.completedScenarios.length}/{scenarios.length}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(userProgress.completedScenarios.length / scenarios.length) * 100}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Score de vigilance</span>
                    <span className="text-blue-400">
                      {userProgress.vigilanceScore}/100
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${userProgress.vigilanceScore}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Conseils rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-amber-900/10 to-amber-900/5 rounded-2xl border border-amber-700/20 p-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Conseil sécurité
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                En situation réelle, prenez toujours le temps de :
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="text-amber-400 mt-0.5">•</div>
                  <span>Vérifier l'identité de l'interlocuteur</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-amber-400 mt-0.5">•</div>
                  <span>Utiliser des canaux de communication officiels</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-amber-400 mt-0.5">•</div>
                  <span>Signaler toute demande suspecte</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}