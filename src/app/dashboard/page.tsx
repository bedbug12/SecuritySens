// app/dashboard/page.tsx (ancien HomePage déplacé ici)
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Target, 
  Award, 
  TrendingUp,
  MailWarning,
  PhoneCall,
  UserCheck,
  QrCode,
  Play,
  Sparkles,
  Users,
  BarChart3,
  Clock,
  ChevronRight,
  Zap,
  Star,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  Home as HomeIcon
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { ScenarioCard } from '@/components/ui/ScenarioCard';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { scenarios } from '@/lib/data/scenarios';
import { useNotification } from '@/components/feedback/NotificationProvider';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const router = useRouter();
  const { userProgress, isLoading } = useProgress();
  const { showNotification } = useNotification();
  const { data: session } = useSession();
  const [featuredScenario, setFeaturedScenario] = useState<any>(null);

  useEffect(() => {
    // Trouver le scénario le plus pertinent pour l'utilisateur
    if (userProgress && scenarios.length > 0) {
      const nextScenario = scenarios.find(
        s => !userProgress.completedScenarios.includes(s.id)
      ) || scenarios[0];
      setFeaturedScenario(nextScenario);
    }
  }, [userProgress]);

  const handleQuickStart = () => {
    if (featuredScenario) {
      showNotification(`🚀 Démarrage du scénario: ${featuredScenario.title}`, 'info');
      router.push(`/scenarios/${featuredScenario.id}`);
    } else {
      showNotification('🎮 Navigation vers les scénarios', 'info');
      router.push('/scenarios');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <HomeIcon className="w-4 h-4" />
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-300">Tableau de bord</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Bonjour, <span className="text-emerald-400">{session?.user?.name || 'Expert'}</span> 👋
          </h1>
          <p className="text-gray-400">
            Voici votre progression et les scénarios recommandés pour vous
          </p>
        </div>

        {/* Progression */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl border border-gray-800 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Votre progression</h2>
                <p className="text-gray-400">Continuez votre parcours de formation</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-emerald-400/10 rounded-full text-emerald-400 text-sm font-medium">
                  Niveau {userProgress.level}
                </div>
                <div className="px-3 py-1 bg-blue-400/10 rounded-full text-blue-400 text-sm font-medium">
                  {userProgress.xp} XP
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { 
                  label: 'Vigilance', 
                  value: userProgress.vigilanceScore, 
                  max: 100,
                  color: 'from-emerald-400 to-green-400',
                  icon: <Target className="w-5 h-5" />
                },
                { 
                  label: 'Scénarios', 
                  value: userProgress.completedScenarios.length, 
                  max: scenarios.length,
                  color: 'from-blue-400 to-cyan-400',
                  icon: <BookOpen className="w-5 h-5" />
                },
                { 
                  label: 'Badges', 
                  value: userProgress.badges.length, 
                  max: 15,
                  color: 'from-purple-400 to-pink-400',
                  icon: <Award className="w-5 h-5" />
                },
                { 
                  label: 'Streak', 
                  value: userProgress.consecutiveCorrect, 
                  max: 10,
                  color: 'from-amber-400 to-orange-400',
                  icon: <Zap className="w-5 h-5" />
                },
              ].map((stat, idx) => (
                <div key={stat.label} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}/10`}>
                        {stat.icon}
                      </div>
                      <span className="text-gray-300">{stat.label}</span>
                    </div>
                    <span className="font-bold">
                      {stat.value}/{stat.max}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Scénario recommandé */}
            {featuredScenario && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-blue-900/20 to-emerald-900/20 rounded-2xl border border-blue-700/30 p-6"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-700/30">
                      <AlertTriangle className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Scénario recommandé</h3>
                      <p className="text-gray-400 text-sm">
                        {featuredScenario.description}
                      </p>
                    </div>
                  </div>
                  <CyberButton
                    variant="primary"
                    onClick={handleQuickStart}
                    icon={<Play className="w-5 h-5" />}
                  >
                    Commencer
                  </CyberButton>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Scénarios récents */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Continuez votre formation</h2>
              <p className="text-gray-400">Scénarios adaptés à votre niveau</p>
            </div>
            <CyberButton
              variant="ghost"
              onClick={() => router.push('/scenarios')}
              icon={<ChevronRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Voir tous
            </CyberButton>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.slice(0, 3).map((scenario, index) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                delay={index * 0.1}
                compact={false}
                
              />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Voir ma progression',
                description: 'Consultez vos statistiques détaillées',
                icon: <TrendingUp className="w-6 h-6" />,
                color: 'from-blue-500 to-cyan-500',
                onClick: () => router.push('/progress')
              },
              {
                title: 'Jouer aux jeux',
                description: 'Testez vos connaissances',
                icon: <Zap className="w-6 h-6" />,
                color: 'from-purple-500 to-pink-500',
                onClick: () => router.push('/games')
              },
              {
                title: 'Mes badges',
                description: 'Vos certifications et récompenses',
                icon: <Award className="w-6 h-6" />,
                color: 'from-amber-500 to-orange-500',
                onClick: () => router.push('/profile#badges')
              },
            ].map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className={`bg-gradient-to-br ${action.color}/10 to-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all text-left`}
              >
                <div className={`bg-gradient-to-br ${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <div className="text-white">
                    {action.icon}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  Accéder
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}