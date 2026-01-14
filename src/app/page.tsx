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
  Play
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { ScenarioCard } from '@/components/ui/ScenarioCard';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { scenarios } from '@/lib/data/scenarios';
import { games } from '@/lib/data/games';
import { useNotification } from '@/components/feedback/NotificationProvider';

export default function HomePage() {
  const router = useRouter();
  const { userProgress } = useProgress();
  const { showNotification } = useNotification();
  const [stats, setStats] = useState({
    totalUsers: 1247,
    attacksPrevented: 8942,
    avgScoreIncrease: 42,
  });

  const threatTypes = [
    { icon: <MailWarning className="w-6 h-6" />, name: 'Phishing', percentage: 65 },
    { icon: <PhoneCall className="w-6 h-6" />, name: 'Vishing', percentage: 20 },
    { icon: <UserCheck className="w-6 h-6" />, name: 'Pretexting', percentage: 10 },
    { icon: <QrCode className="w-6 h-6" />, name: 'QR Codes', percentage: 5 },
  ];

  const handleQuickStart = () => {
    showNotification('🚀 Démarrage de la formation...', 'info');
    router.push('/scenarios');
  };

  const handleDemo = () => {
    showNotification('🎮 Mode démo activé', 'info');
    router.push('/demo');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Hero Section avec animation */}
        <section className="relative overflow-hidden py-12 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-emerald-900/10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-full border border-blue-700/50 mb-6">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">Formation Cybersécurité Active</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                SecuritySense
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transformez vos employés en <span className="text-emerald-400 font-semibold">première ligne de défense</span> 
              contre les attaques d'ingénierie sociale avec des simulations interactives
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <CyberButton
                variant="primary"
                onClick={handleQuickStart}
                icon={<Play className="w-5 h-5" />}
                size="lg"
              >
                Démarrer la formation
              </CyberButton>
              <CyberButton
                variant="outline"
                onClick={handleDemo}
                size="lg"
              >
                Voir la démo
              </CyberButton>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: userProgress.level, label: 'Niveau', icon: <TrendingUp />, color: 'text-blue-400' },
              { value: `${userProgress.vigilanceScore}/100`, label: 'Vigilance', icon: <Target />, color: 'text-emerald-400' },
              { value: userProgress.completedScenarios.length, label: 'Scénarios', icon: <Award />, color: 'text-purple-400' },
              { value: userProgress.badges.length, label: 'Badges', icon: <Shield />, color: 'text-amber-400' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`${stat.color} opacity-80`}>
                    {stat.icon}
                  </div>
                  <div className="text-xs text-gray-500">+12%</div>
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scénarios Recommandés */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Scénarios interactifs</h2>
              <p className="text-gray-400">Apprenez en situation réelle avec feedback immédiat</p>
            </div>
            <CyberButton
              variant="ghost"
              onClick={() => router.push('/scenarios')}
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

        {/* Types de Menaces */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Types de menaces couverts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {threatTypes.map((threat, index) => (
              <motion.div
                key={threat.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    {threat.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{threat.name}</h3>
                    <div className="text-sm text-gray-500">{threat.percentage}% des attaques</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fréquence</span>
                    <span className="text-emerald-400">{threat.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${threat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Prêt à renforcer votre premier rempart humain ?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Rejoignez les entreprises qui ont déjà formé leurs équipes et réduit leurs risques de 85%
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CyberButton
                  variant="primary"
                  onClick={handleQuickStart}
                  size="lg"
                >
                  Commencer gratuitement
                </CyberButton>
                <CyberButton
                  variant="outline"
                  onClick={() => router.push('/demo')}
                  size="lg"
                >
                  Demander une démo entreprise
                </CyberButton>
              </div>
              
              <div className="mt-8 text-sm text-gray-500">
                Aucune carte bancaire requise • Configuration en 5 minutes
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}