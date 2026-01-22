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
  ChevronRight,
  Users,
  Clock,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { scenarios } from '@/lib/data/scenarios';
import { games } from '@/lib/data/games';
import { CyberButton } from '@/components/ui/CyberButton';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function ProgressPage() {
  const router = useRouter();
  const { userProgress, isLoading } = useProgress();
  const { data: session } = useSession();
  const [userStats, setUserStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Charger les statistiques utilisateur
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        const response = await fetch('/api/user/stats');
        if (response.ok) {
          const data = await response.json();
          setUserStats(data);
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    };

    if (session?.user?.id) {
      loadUserStats();
    }
  }, [session]);

  // Simulation d'activité récente (à remplacer par vos données réelles)
  useEffect(() => {
    if (userProgress && scenarios.length > 0) {
      const activities = userProgress.completedScenarios.slice(0, 4).map((scenarioId, index) => {
        const scenario = scenarios.find(s => s.id === scenarioId);
        const daysAgo = index + 1;
        return {
          type: 'scenario',
          id: scenarioId,
          name: scenario?.title || 'Scénario complété',
          score: 85 - (index * 5), // Score fictif
          date: index === 0 ? 'Aujourd\'hui' : `Il y a ${daysAgo} jour${daysAgo > 1 ? 's' : ''}`,
          scenario: scenario
        };
      });
      setRecentActivity(activities);
    }
  }, [userProgress]);

  // Calcul des statistiques
  const stats = {
    totalScenarios: scenarios.length,
    completedScenarios: userProgress.completedScenarios.length,
    completionRate: Math.round((userProgress.completedScenarios.length / scenarios.length) * 100),
    totalGames: games.length,
    gamesPlayed: userProgress.gamesPlayed,
    avgScore: userStats?.averageScore || userProgress.vigilanceScore,
    daysActive: userStats?.streak || 7,
    currentStreak: userProgress.consecutiveCorrect,
    totalXP: userProgress.xp,
    level: userProgress.level,
    vigilanceScore: userProgress.vigilanceScore,
    badgesCount: userProgress.badges.length,
    lastPlayed: userProgress.lastPlayed ? 
      new Date(userProgress.lastPlayed).toLocaleDateString('fr-FR') : 
      'Jamais'
  };

  // Badges disponibles
  const availableBadges = [
    { 
      id: 'starter', 
      name: 'Débutant', 
      icon: '🛡️', 
      description: 'Première connexion',
      color: 'from-blue-500 to-cyan-500',
      unlocked: userProgress.badges.includes('starter')
    },
    { 
      id: 'learner', 
      name: 'Apprenant', 
      icon: '📚', 
      description: '3 scénarios complétés',
      color: 'from-emerald-500 to-green-500',
      unlocked: userProgress.badges.includes('learner') || stats.completedScenarios >= 3
    },
    { 
      id: 'scenario-master', 
      name: 'Maître des scénarios', 
      icon: '🎯', 
      description: '5 scénarios complétés',
      color: 'from-purple-500 to-pink-500',
      unlocked: userProgress.badges.includes('scenario-master') || stats.completedScenarios >= 5
    },
    { 
      id: 'perfect-streak', 
      name: 'Série parfaite', 
      icon: '⚡', 
      description: '3 bonnes réponses consécutives',
      color: 'from-amber-500 to-orange-500',
      unlocked: userProgress.badges.includes('perfect-streak') || stats.currentStreak >= 3
    },
    { 
      id: 'vigilant', 
      name: 'Vigilant', 
      icon: '👁️', 
      description: 'Score de vigilance > 80',
      color: 'from-blue-500 to-indigo-500',
      unlocked: userProgress.badges.includes('vigilant') || stats.vigilanceScore >= 80
    },
    { 
      id: 'security-expert', 
      name: 'Expert sécurité', 
      icon: '👑', 
      description: 'Score de vigilance > 90',
      color: 'from-yellow-500 to-amber-500',
      unlocked: userProgress.badges.includes('security-expert') || stats.vigilanceScore >= 90
    },
    { 
      id: 'consistent', 
      name: 'Régulier', 
      icon: '📅', 
      description: '3 jours consécutifs d\'activité',
      color: 'from-emerald-500 to-teal-500',
      unlocked: userProgress.badges.includes('consistent')
    },
    { 
      id: 'cyber-master', 
      name: 'Maître Cyber', 
      icon: '💻', 
      description: 'Tous les scénarios complétés',
      color: 'from-red-500 to-pink-500',
      unlocked: userProgress.badges.includes('cyber-master') || stats.completionRate === 100
    },
  ];

  const getLevelProgress = () => {
    const xpForNextLevel = 100 * Math.pow(1.5, stats.level - 1);
    const currentXp = stats.totalXP % xpForNextLevel;
    return (currentXp / xpForNextLevel) * 100;
  };

  const getXPForNextLevel = () => {
    return Math.floor(100 * Math.pow(1.5, stats.level - 1));
  };

  const getUnlockedBadges = () => {
    return availableBadges.filter(badge => badge.unlocked);
  };

  const getNextBadges = () => {
    return availableBadges
      .filter(badge => !badge.unlocked)
      .slice(0, 3);
  };

  const getPerformanceTrend = () => {
    if (!userStats?.recentScores || userStats.recentScores.length < 2) {
      return { trend: 'stable', change: 0 };
    }
    
    const recentScores = userStats.recentScores.map((s: any) => s.score);
    const lastScore = recentScores[recentScores.length - 1];
    const previousScore = recentScores[recentScores.length - 2];
    const change = lastScore - previousScore;
    
    return {
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      change: Math.abs(change)
    };
  };

  const performanceTrend = getPerformanceTrend();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Chargement de votre progression...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header avec infos utilisateur */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                  <span className="font-bold text-white text-lg">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {session?.user?.name || 'Utilisateur'}
                  </h1>
                  <p className="text-gray-400">{session?.user?.email}</p>
                </div>
              </div>
              <p className="text-xl text-gray-400">
                Suivez votre évolution dans la formation SecuritySense
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Dernière activité</div>
                <div className="font-semibold">{stats.lastPlayed}</div>
              </div>
              <CyberButton
                variant="primary"
                onClick={() => router.push('/scenarios')}
                icon={<Target className="w-5 h-5" />}
              >
                Continuer
              </CyberButton>
            </div>
          </div>
        </motion.div>

        {/* Niveau & XP - Section améliorée */}
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
                  {stats.level}
                </div>
                <p className="text-gray-400 mt-2">
                  {stats.totalXP} points d'expérience accumulés
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    performanceTrend.trend === 'up' ? 'bg-emerald-400/10 text-emerald-400' :
                    performanceTrend.trend === 'down' ? 'bg-red-400/10 text-red-400' :
                    'bg-blue-400/10 text-blue-400'
                  }`}>
                    {performanceTrend.trend === 'up' ? '📈 En progression' :
                     performanceTrend.trend === 'down' ? '📉 En baisse' : '📊 Stable'}
                  </div>
                  {performanceTrend.change > 0 && (
                    <span className="text-sm text-emerald-400">
                      +{performanceTrend.change} points
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-1 max-w-2xl">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">
                    Niveau {stats.level} • {stats.totalXP} XP
                  </span>
                  <span className="text-emerald-400">
                    {getXPForNextLevel() - (stats.totalXP % getXPForNextLevel())} XP pour niveau {stats.level + 1}
                  </span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getLevelProgress()}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-cyan-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-400">
                      {stats.completedScenarios}/{stats.totalScenarios}
                    </div>
                    <div className="text-sm text-gray-400">Scénarios</div>
                  </div>
                  <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-400">
                      {stats.gamesPlayed}
                    </div>
                    <div className="text-sm text-gray-400">Jeux joués</div>
                  </div>
                  <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-400">
                      {stats.avgScore}%
                    </div>
                    <div className="text-sm text-gray-400">Score moyen</div>
                  </div>
                  <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                    <div className="text-2xl font-bold text-amber-400">
                      {stats.currentStreak}
                    </div>
                    <div className="text-sm text-gray-400">Série actuelle</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid détaillées */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-xl p-6 border border-blue-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-400/10">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
            </div>
            <div className="text-sm text-gray-400">Taux de complétion</div>
            <div className="mt-2 text-xs text-blue-400">
              {stats.totalScenarios - stats.completedScenarios} restants
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-700/10 rounded-xl p-6 border border-emerald-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-400/10">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold">{stats.vigilanceScore}/100</div>
            </div>
            <div className="text-sm text-gray-400">Score de vigilance</div>
            <div className="mt-2 text-xs text-emerald-400">
              {stats.vigilanceScore >= 80 ? 'Excellent !' : 'À améliorer'}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-900/20 to-amber-700/10 rounded-xl p-6 border border-amber-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-400/10">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold">{stats.daysActive}</div>
            </div>
            <div className="text-sm text-gray-400">Jours actifs</div>
            <div className="mt-2 text-xs text-amber-400">
              {stats.daysActive >= 7 ? 'Très actif !' : 'Continuez !'}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-700/10 rounded-xl p-6 border border-purple-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-400/10">
                <Trophy className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold">{stats.badgesCount}</div>
            </div>
            <div className="text-sm text-gray-400">Badges obtenus</div>
            <div className="mt-2 text-xs text-purple-400">
              {availableBadges.length - stats.badgesCount} à débloquer
            </div>
          </div>
        </motion.div>

        {/* Badges - Section améliorée */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Badges obtenus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-400" />
                Vos badges ({getUnlockedBadges().length}/{availableBadges.length})
              </h2>
              <div className="text-sm text-gray-400">
                {Math.round((getUnlockedBadges().length / availableBadges.length) * 100)}% complété
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableBadges.map((badge, index) => {
                const isUnlocked = badge.unlocked;
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-xl p-4 border transition-all ${
                      isUnlocked
                        ? `bg-gradient-to-br ${badge.color}/20 border-${badge.color.split('-')[1]}-700/50`
                        : 'bg-gray-900/30 border-gray-800/50 grayscale'
                    }`}
                  >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-400">{badge.description}</p>
                    <div className={`mt-3 text-xs font-medium px-2 py-1 rounded-full inline-block ${
                      isUnlocked
                        ? 'bg-emerald-400/10 text-emerald-400'
                        : 'bg-gray-800/50 text-gray-500'
                    }`}>
                      {isUnlocked ? '✓ Obtenu' : 'À débloquer'}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Prochains badges à débloquer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-400" />
              Prochains objectifs
            </h3>
            
            <div className="space-y-4">
              {getNextBadges().map((badge, index) => (
                <div
                  key={badge.id}
                  className="bg-gray-900/50 rounded-xl p-4 border border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl opacity-50">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{badge.name}</div>
                      <div className="text-xs text-gray-400">{badge.description}</div>
                    </div>
                    <div className="text-xs text-gray-500 px-2 py-1 bg-gray-800/50 rounded">
                      À venir
                    </div>
                  </div>
                </div>
              ))}
              
              {stats.completionRate < 100 && (
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-xl p-4 border border-blue-800/30">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Complétez tous les scénarios</div>
                      <div className="text-xs text-gray-400">
                        {stats.completedScenarios}/{stats.totalScenarios} complétés
                      </div>
                    </div>
                    <div className="text-xs text-blue-400">
                      {100 - stats.completionRate}%
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>
              )}
              
              {stats.vigilanceScore < 100 && (
                <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-700/10 rounded-xl p-4 border border-emerald-800/30">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Atteignez 100% de vigilance</div>
                      <div className="text-xs text-gray-400">
                        Score actuel: {stats.vigilanceScore}/100
                      </div>
                    </div>
                    <div className="text-xs text-emerald-400">
                      {100 - stats.vigilanceScore} pts
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                      style={{ width: `${stats.vigilanceScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Activité récente & Performances */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Activité récente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-400" />
                Activité récente
              </h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">
                Voir l'historique complet
              </button>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className={`p-6 flex items-center justify-between ${
                      index !== recentActivity.length - 1 ? 'border-b border-gray-800' : ''
                    } hover:bg-gray-800/30 transition-colors cursor-pointer`}
                    onClick={() => activity.scenario && router.push(`/scenarios/${activity.scenario.id}`)}
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
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {activity.date}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        activity.score >= 80 ? 'bg-emerald-400/10 text-emerald-400' :
                        activity.score >= 60 ? 'bg-blue-400/10 text-blue-400' :
                        'bg-amber-400/10 text-amber-400'
                      }`}>
                        {activity.score}%
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Aucune activité récente</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Commencez un scénario pour voir votre activité ici
                  </p>
                  <CyberButton
                    variant="primary"
                    onClick={() => router.push('/scenarios')}
                    size="sm"
                  >
                    Commencer un scénario
                  </CyberButton>
                </div>
              )}
            </div>
          </motion.div>

          {/* Statistiques de performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Performances
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-400">Score moyen</div>
                  <div className="text-lg font-bold text-emerald-400">
                    {stats.avgScore}%
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                    style={{ width: `${stats.avgScore}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-400">Taux de réussite</div>
                  <div className="text-lg font-bold text-blue-400">
                    {stats.completionRate}%
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-400">Série actuelle</div>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold text-amber-400">
                      {stats.currentStreak}
                    </div>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {stats.currentStreak >= 3 ? 'Bonne série !' : 'Continuez pour améliorer votre série'}
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">Dernière activité</div>
                  <div className="text-sm font-medium">{stats.lastPlayed}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {stats.lastPlayed === 'Jamais' ? 
                    'Commencez votre première activité' :
                    'Continuez votre progression régulièrement'
                  }
                </div>
              </div>
            </div>
            
            <CyberButton
              variant="outline"
              onClick={() => router.push('/scenarios')}
              className="w-full mt-6"
              icon={<Target className="w-5 h-5" />}
            >
              Reprendre l'entraînement
            </CyberButton>
          </motion.div>
        </div>

        {/* Recommandations personnalisées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-800/30 p-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Recommandations personnalisées</h2>
              <p className="text-gray-400">
                Basé sur votre progression et vos performances
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-emerald-400/10 rounded-full text-emerald-400 text-sm">
                {getUnlockedBadges().length} badges
              </div>
              <div className="px-3 py-1 bg-blue-400/10 rounded-full text-blue-400 text-sm">
                Niveau {stats.level}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recommandation 1 */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold">Scénarios recommandés</div>
                  <div className="text-sm text-gray-400">
                    {scenarios.length - stats.completedScenarios} disponibles
                  </div>
                </div>
              </div>
              <CyberButton
                variant="primary"
                onClick={() => router.push('/scenarios')}
                className="w-full"
              >
                Explorer les scénarios
              </CyberButton>
            </div>
            
            {/* Recommandation 2 */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-400/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold">Améliorer votre score</div>
                  <div className="text-sm text-gray-400">
                    Objectif: {stats.vigilanceScore < 80 ? '80 points' : '100 points'}
                  </div>
                </div>
              </div>
              <CyberButton
                variant="outline"
                onClick={() => router.push('/games')}
                className="w-full"
              >
                S'entraîner avec les jeux
              </CyberButton>
            </div>
            
            {/* Recommandation 3 */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="font-semibold">Badges à débloquer</div>
                  <div className="text-sm text-gray-400">
                    {availableBadges.length - stats.badgesCount} restants
                  </div>
                </div>
              </div>
              <CyberButton
                variant="outline"
                onClick={() => router.push('/progress')}
                className="w-full"
              >
                Voir les objectifs
              </CyberButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}