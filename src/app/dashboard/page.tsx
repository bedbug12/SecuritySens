'use client';

import { motion } from 'framer-motion';
import { 
  Users,
  TrendingUp,
  AlertTriangle,
  Shield,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function DashboardPage() {
  // Données simulées pour le dashboard admin
  const stats = {
    totalUsers: 156,
    activeUsers: 124,
    avgScore: 72,
    incidentsPrevented: 42,
    avgCompletionRate: 68,
    riskLevel: 'Moyen'
  };

  const recentActivity = [
    { user: 'Marie Dubois', action: 'Scénario phishing', score: 85, time: '10 min' },
    { user: 'Jean Martin', action: 'Jeu Vrai/Faux', score: 70, time: '25 min' },
    { user: 'Sophie Bernard', action: 'Scénario vishing', score: 90, time: '1h' },
    { user: 'Thomas Petit', action: 'Scénario phishing', score: 60, time: '2h' },
  ];

  const teams = [
    { name: 'Direction', score: 85, users: 12, risk: 'Faible' },
    { name: 'IT', score: 92, users: 8, risk: 'Très faible' },
    { name: 'RH', score: 65, users: 6, risk: 'Moyen' },
    { name: 'Commercial', score: 58, users: 24, risk: 'Élevé' },
    { name: 'Marketing', score: 71, users: 18, risk: 'Moyen' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Tableau de bord administrateur
              </h1>
              <p className="text-xl text-gray-400">
                Vue d'ensemble de la sécurité de votre entreprise
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-700/30 border border-blue-700/30">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">Niveau 3</div>
                <div className="text-sm text-gray-400">Maturité sécurité</div>
              </div>
            </div>
          </div>

          {/* Stats principales */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <div className="col-span-2 bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-400" />
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
              </div>
              <div className="text-gray-400">Utilisateurs formés</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <div className="text-3xl font-bold">{stats.avgScore}%</div>
              </div>
              <div className="text-gray-400">Score moyen</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-amber-400" />
                <div className="text-3xl font-bold">{stats.avgCompletionRate}%</div>
              </div>
              <div className="text-gray-400">Complétion</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div className="text-3xl font-bold">{stats.incidentsPrevented}</div>
              </div>
              <div className="text-gray-400">Incidents évités</div>
            </div>
            
            <div className="col-span-2 bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Niveau de risque</div>
                  <div className="text-3xl font-bold">{stats.riskLevel}</div>
                </div>
                <div className={`px-4 py-2 rounded-lg ${
                  stats.riskLevel === 'Faible' ? 'bg-emerald-400/10 text-emerald-400' :
                  stats.riskLevel === 'Moyen' ? 'bg-amber-400/10 text-amber-400' :
                  'bg-red-400/10 text-red-400'
                }`}>
                  {stats.riskLevel === 'Faible' ? '✓ Sécurisé' :
                   stats.riskLevel === 'Moyen' ? '⚠️ Surveiller' :
                   '🔴 Action requise'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Graphique et activité */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Graphique */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Progression globale</h2>
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            
            <div className="h-64 flex items-end gap-2">
              {[30, 45, 60, 75, 85, 92, 88, 90, 95, 93, 96, 98].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                    style={{ height: `${value}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2">{index + 1}</div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-4 text-sm text-gray-400">
              <span>Mois 1</span>
              <span>Mois 12</span>
            </div>
          </motion.div>

          {/* Activité récente */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6"
          >
            <h2 className="text-xl font-bold mb-6">Activité récente</h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="font-semibold">{activity.user}</div>
                    <div className="text-sm text-gray-400">{activity.action}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activity.score >= 80 ? 'bg-emerald-400/10 text-emerald-400' :
                      activity.score >= 60 ? 'bg-blue-400/10 text-blue-400' :
                      'bg-amber-400/10 text-amber-400'
                    }`}>
                      {activity.score}%
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance par équipe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Performance par équipe</h2>
          
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-800 font-semibold text-gray-400">
              <div className="col-span-4">Équipe</div>
              <div className="col-span-2">Score</div>
              <div className="col-span-2">Utilisateurs</div>
              <div className="col-span-2">Complétion</div>
              <div className="col-span-2">Niveau de risque</div>
            </div>
            
            {teams.map((team, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 p-6 border-b border-gray-800 hover:bg-gray-800/20 transition-colors">
                <div className="col-span-4 font-semibold">{team.name}</div>
                <div className="col-span-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                    team.score >= 80 ? 'bg-emerald-400/10 text-emerald-400' :
                    team.score >= 60 ? 'bg-blue-400/10 text-blue-400' :
                    'bg-red-400/10 text-red-400'
                  }`}>
                    {team.score}%
                  </div>
                </div>
                <div className="col-span-2">{team.users} utilisateurs</div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                        style={{ width: `${Math.min(100, team.score)}%` }}
                      />
                    </div>
                    <span className="text-sm">{team.score}%</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                    team.risk === 'Très faible' ? 'bg-emerald-400/10 text-emerald-400' :
                    team.risk === 'Faible' ? 'bg-emerald-400/10 text-emerald-400' :
                    team.risk === 'Moyen' ? 'bg-amber-400/10 text-amber-400' :
                    'bg-red-400/10 text-red-400'
                  }`}>
                    {team.risk}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-2xl border border-blue-800/30 p-6">
            <h3 className="text-lg font-bold mb-4">Actions requises</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Campagnes à lancer</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Utilisateurs à risque</span>
                <span className="font-semibold text-amber-400">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Scénarios à créer</span>
                <span className="font-semibold">2</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-700/10 rounded-2xl border border-emerald-800/30 p-6">
            <h3 className="text-lg font-bold mb-4">Statistiques positives</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Amélioration moyenne</span>
                <span className="font-semibold text-emerald-400">+24%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Satisfaction</span>
                <span className="font-semibold">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Engagement</span>
                <span className="font-semibold">87%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-700/10 rounded-2xl border border-purple-800/30 p-6">
            <h3 className="text-lg font-bold mb-4">Prochaines étapes</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">Formation équipe commerciale</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">Analyse trimestrielle</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm">Mise à jour des scénarios</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}