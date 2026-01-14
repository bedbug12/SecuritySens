'use client';

import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Shield, 
  Zap,
  Clock,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { calculateLevel } from '@/lib/utils/scoring';

export function ProgressTracker() {
  const { userProgress } = useProgress();
  
  const { level, xpToNextLevel, progress } = calculateLevel(userProgress.xp);
  const badges = userProgress.badges.length;
  const completedScenarios = userProgress.completedScenarios.length;
  
  // Stats pour affichage
  const stats = [
    {
      icon: <Target className="w-4 h-4" />,
      label: 'Score de vigilance',
      value: userProgress.vigilanceScore,
      max: 100,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10'
    },
    {
      icon: <Award className="w-4 h-4" />,
      label: 'Scénarios complétés',
      value: completedScenarios,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: 'Badges obtenus',
      value: badges,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: 'Jeux joués',
      value: userProgress.gamesPlayed,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10'
    }
  ];

  // Évaluation du niveau de sécurité
  const getSecurityLevel = (score: number) => {
    if (score >= 90) return { label: 'Expert', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
    if (score >= 75) return { label: 'Avancé', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (score >= 60) return { label: 'Intermédiaire', color: 'text-amber-400', bg: 'bg-amber-400/10' };
    return { label: 'Débutant', color: 'text-gray-400', bg: 'bg-gray-400/10' };
  };

  const securityLevel = getSecurityLevel(userProgress.vigilanceScore);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-400/10 to-emerald-400/10">
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Votre progression</h3>
            <p className="text-sm text-gray-400">Suivi en temps réel</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${securityLevel.bg} ${securityLevel.color}`}>
          {securityLevel.label}
        </div>
      </div>

      {/* Niveau et XP */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Niveau {level}</span>
          </div>
          <span className="text-sm text-gray-400">
            {xpToNextLevel} XP pour le niveau {level + 1}
          </span>
        </div>
        
        {/* Barre de progression */}
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
          />
        </div>
        
        {/* Marqueurs de progression */}
        <div className="flex justify-between mt-1">
          {[0, 25, 50, 75, 100].map((mark) => (
            <div key={mark} className="relative">
              <div className={`w-1 h-1 rounded-full ${
                progress >= mark ? 'bg-emerald-400' : 'bg-gray-600'
              }`} />
              {mark === 100 && (
                <div className="absolute -top-6 -right-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${stat.bgColor} border-gray-800`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-gray-800/50">
                {stat.icon}
              </div>
              <span className="text-sm text-gray-400">{stat.label}</span>
            </div>
            
            <div className="flex items-end gap-1">
              <span className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
              {stat.max && (
                <span className="text-sm text-gray-500">/{stat.max}</span>
              )}
            </div>
            
            {/* Barre de progression pour le score de vigilance */}
            {stat.label === 'Score de vigilance' && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    className={`h-full ${stat.color.replace('text', 'bg')}`}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Série de bonnes réponses */}
      {userProgress.consecutiveCorrect > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-900/20 to-emerald-700/10 border border-emerald-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-400/10">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-medium">Bonne série !</div>
                <div className="text-sm text-gray-400">
                  {userProgress.consecutiveCorrect} bonnes réponses consécutives
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {userProgress.consecutiveCorrect} 🔥
            </div>
          </div>
        </div>
      )}

      {/* Conseils d'amélioration */}
      <div className="pt-6 border-t border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-400">Conseils d'amélioration</h4>
          <BarChart3 className="w-4 h-4 text-gray-500" />
        </div>
        
        <div className="space-y-3">
          {userProgress.vigilanceScore < 80 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-900/10 border border-blue-800/20">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <div className="flex-1">
                <div className="text-sm">Améliorez votre score de vigilance</div>
                <div className="text-xs text-gray-400">
                  Complétez plus de scénarios pour atteindre 80 points
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
          )}
          
          {completedScenarios < 5 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-900/10 border border-purple-800/20">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <div className="flex-1">
                <div className="text-sm">Terminez 5 scénarios</div>
                <div className="text-xs text-gray-400">
                  Débloquez le badge "Maître des scénarios"
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
          )}
          
          {userProgress.gamesPlayed < 3 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-900/10 border border-amber-800/20">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="flex-1">
                <div className="text-sm">Jouez à plus de jeux</div>
                <div className="text-xs text-gray-400">
                  Essayez différents types de jeux pour diversifier vos compétences
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
          )}
        </div>
      </div>

      {/* Dernière activité */}
      {userProgress.lastPlayed && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="text-xs text-gray-400">
            Dernière activité :{' '}
            <span className="text-gray-300">
              {new Date(userProgress.lastPlayed).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Version compacte pour la sidebar
export function CompactProgressTracker() {
  const { userProgress } = useProgress();
  const { level, progress } = calculateLevel(userProgress.xp);

  return (
    <div className="space-y-4">
      {/* Niveau */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Niveau {level}</span>
          <span className="text-xs text-emerald-400">{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
          />
        </div>
      </div>

      {/* Score de vigilance */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Vigilance</span>
          <span className="text-xs text-emerald-400">{userProgress.vigilanceScore}/100</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${userProgress.vigilanceScore}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
          />
        </div>
      </div>

      {/* Badges rapides */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-3 h-3 text-purple-400" />
          <span className="text-xs text-gray-400">Badges</span>
        </div>
        <span className="text-xs text-purple-400">{userProgress.badges.length}</span>
      </div>
    </div>
  );
}