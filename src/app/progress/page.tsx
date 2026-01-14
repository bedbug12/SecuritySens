'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp,
  Target,
  Trophy,
  Award,
  Star,
  Calendar,
  Zap,
  Shield,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { scenarios } from '@/lib/data/scenarios';
import { games } from '@/lib/data/games';
import { CyberButton } from '@/components/ui/CyberButton';

export default function ProgressPage() {
  const router = useRouter();
  const { userProgress } = useProgress();

  // Calcul des statistiques
  const stats = {
    totalScenarios: scenarios.length,
    completedScenarios: userProgress.completedScenarios.length,
    completionRate: Math.round((userProgress.completedScenarios.length / scenarios.length) * 100),
    totalGames: games.length,
    gamesPlayed: userProgress.gamesPlayed,
    avgScore: userProgress.vigilanceScore,
    daysActive: 7, // À implémenter avec une logique réelle
    streak: userProgress.consecutiveCorrect,
  };

  const badges = [
    { id: 'starter', name: 'Débutant', icon: '🛡️', description: 'Premier scénario complété' },
    { id: 'scenario-master', name: 'Maître des scénarios', icon: '🎯', description: '5 scénarios complétés' },
    { id: 'perfect-streak', name: 'Série parfaite', icon: '⚡', description: '5 bonnes réponses consécutives' },
    { id: 'security-expert', name: 'Expert sécurité', icon: '👑', description: 'Score de vigilance > 90' },
  ];

  const getLevelProgress = () => {
    const xpForNextLevel = 100;
    const currentXp = userProgress.xp % 100;
    return (currentXp / xpForNextLevel) * 100;
  };

  const getRecentActivity = () => {
    // Simulation d'activité récente
    return [
      { type: 'scenario', name: 'Email du PDG', score: 85, date: 'Aujourd\'hui' },
      { type: 'game', name: 'Vrai ou Faux', score: 70, date: 'Hier' },
      { type: 'scenario', name: 'Appel IT', score: 90, date: 'Il y a 2 jours' },
      { type: 'game', name: 'Spot the Signs', score: 65, date: 'Il y a 3 jours' },
    ];
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Ma progression
              </h1>
              <p className="text-xl text-gray-400">
                Suivez votre évolution et vos accomplissements
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <CyberButton
                variant="outline"
                onClick={() => router.push('/scenarios')}
              >
                Continuer à s'entraîner
              </CyberButton>
            </div>
          </div>
        </motion.div>

        {/* Niveau & XP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="text-sm text-gray-400 mb-2">NIVEAU ACTUEL</div>
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  {userProgress.level}
                </div>
                <p className="text-gray-400 mt-2">
                  Expérience de sécurité accumulée
                </p>
              </div>
              
              <div className="flex-1 max-w-2xl">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">XP: {userProgress.xp}</span>
                  <span className="text-emerald-400">
                    Prochain niveau: {100 - (userProgress.xp % 100)} XP
                  </span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getLevelProgress()}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {stats.completedScenarios}
                    </div>
                    <div className="text-sm text-gray-400">Scénarios</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      {stats.gamesPlayed}
                    </div>
                    <div className="text-sm text-gray-400">Jeux</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {stats.avgScore}
                    </div>
                    <div className="text-sm text-gray-400">Score moyen</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-400/10">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
            </div>
            <div className="text-sm text-gray-400">Taux de complétion</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-400/10">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold">{stats.streak}</div>
            </div>
            <div className="text-sm text-gray-400">Bonne série</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-400/10">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold">{stats.daysActive}</div>
            </div>
            <div className="text-sm text-gray-400">Jours actifs</div>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-400/10">
                <Trophy className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold">{userProgress.badges.length}</div>
            </div>
            <div className="text-sm text-gray-400">Badges obtenus</div>
          </div>
        </motion.div>

        {/* Grille de badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-400" />
            Badges obtenus
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => {
              const hasBadge = userProgress.badges.includes(badge.id);
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-xl p-6 border ${
                    hasBadge
                      ? 'bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border-yellow-700/50'
                      : 'bg-gray-900/30 border-gray-800 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-3">{badge.icon}</div>
                  <h3 className="font-semibold mb-1">{badge.name}</h3>
                  <p className="text-sm text-gray-400">{badge.description}</p>
                  {hasBadge && (
                    <div className="mt-4 text-xs text-yellow-400 font-medium">
                      ✓ Obtenu
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Activité récente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-400" />
              Activité récente
            </h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Voir tout
            </button>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            {getRecentActivity().map((activity, index) => (
              <div
                key={index}
                className={`p-6 flex items-center justify-between ${
                  index !== getRecentActivity().length - 1 ? 'border-b border-gray-800' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    activity.type === 'scenario'
                      ? 'bg-blue-400/10'
                      : 'bg-purple-400/10'
                  }`}>
                    {activity.type === 'scenario' ? (
                      <Shield className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Star className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{activity.name}</div>
                    <div className="text-sm text-gray-400">{activity.date}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-lg">{activity.score}</div>
                    <div className="text-sm text-gray-400">score</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Graphiques & Tendances */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Score de vigilance */}
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Score de vigilance</h3>
                <p className="text-gray-400 text-sm">Évolution sur 30 jours</p>
              </div>
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            
            <div className="h-48 flex items-end gap-1 mb-4">
              {[65, 70, 68, 75, 80, 85, 82, 88, 90, 92, 95, 93, 96, 98, 100].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ delay: index * 0.05 }}
                  className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t"
                />
              ))}
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">
                {userProgress.vigilanceScore}/100
              </div>
              <div className="text-sm text-gray-400">Score actuel</div>
            </div>
          </div>

          {/* Recommandations */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-2xl border border-blue-800/30 p-6">
            <h3 className="text-xl font-bold mb-6">Prochaines étapes</h3>
            
            <div className="space-y-4">
              {stats.completionRate < 50 && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Complétez plus de scénarios</div>
                    <div className="text-sm text-gray-400">
                      {stats.totalScenarios - stats.completedScenarios} scénarios restants
                    </div>
                  </div>
                </div>
              )}
              
              {userProgress.vigilanceScore < 80 && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Améliorez votre score de vigilance</div>
                    <div className="text-sm text-gray-400">
                      Objectif: atteindre 80 points
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-purple-400" />
                </div>
                <div>
                  <div className="font-semibold">Essayez un nouveau type de jeu</div>
                  <div className="text-sm text-gray-400">
                    Diversifiez votre entraînement
                  </div>
                </div>
              </div>
            </div>
            
            <CyberButton
              variant="primary"
              onClick={() => router.push('/scenarios')}
              className="w-full mt-6"
            >
              Continuer l'entraînement
            </CyberButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}