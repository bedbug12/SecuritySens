'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Filter,
  Search,
  Target,
  AlertTriangle,
  Clock,
  TrendingUp,
  Shield,
  Mail,
  Phone,
  User,
  Lock,
  QrCode
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CyberButton } from '@/components/ui/CyberButton';
import { ScenarioCard } from '@/components/ui/ScenarioCard';
import { useProgress } from '@/lib/contexts/ProgressContext';
import { scenarios } from '@/lib/data/scenarios';

export default function ScenariosPage() {
  const router = useRouter();
  const { userProgress } = useProgress();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filtrer les scénarios
  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = searchTerm === '' || 
      scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || 
      scenario.type === selectedType;
    
    const matchesDifficulty = selectedDifficulty === 'all' || 
      scenario.difficulty === selectedDifficulty;
    
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'completed' && userProgress.completedScenarios.includes(scenario.id)) ||
      (selectedStatus === 'incomplete' && !userProgress.completedScenarios.includes(scenario.id));

    return matchesSearch && matchesType && matchesDifficulty && matchesStatus;
  });

  // Statistiques
  const stats = {
    totalScenarios: scenarios.length,
    completed: userProgress.completedScenarios.length,
    completionRate: Math.round((userProgress.completedScenarios.length / scenarios.length) * 100),
    avgScore: 72,
  };

  const scenarioTypes = [
    { id: 'all', label: 'Tous', icon: <Target className="w-4 h-4" />, count: scenarios.length },
    { id: 'phishing', label: 'Phishing', icon: <Mail className="w-4 h-4" />, count: scenarios.filter(s => s.type === 'phishing').length },
    { id: 'vishing', label: 'Vishing', icon: <Phone className="w-4 h-4" />, count: scenarios.filter(s => s.type === 'vishing').length },
    { id: 'pretexting', label: 'Pretexting', icon: <User className="w-4 h-4" />, count: scenarios.filter(s => s.type === 'pretexting').length },
    { id: 'tailgating', label: 'Tailgating', icon: <Lock className="w-4 h-4" />, count: scenarios.filter(s => s.type === 'tailgating').length },
    { id: 'qr', label: 'QR Code', icon: <QrCode className="w-4 h-4" />, count: scenarios.filter(s => s.type === 'qr').length },
  ];

  const difficultyLevels = [
    { id: 'all', label: 'Tous' },
    { id: 'beginner', label: 'Débutant' },
    { id: 'intermediate', label: 'Intermédiaire' },
    { id: 'advanced', label: 'Avancé' },
  ];

  const statusOptions = [
    { id: 'all', label: 'Tous' },
    { id: 'completed', label: 'Complétés' },
    { id: 'incomplete', label: 'À faire' },
  ];

  const handleStartRecommended = () => {
    const recommended = scenarios.find(s => 
      !userProgress.completedScenarios.includes(s.id) && s.difficulty === 'beginner'
    );
    if (recommended) {
      router.push(`/scenarios/${recommended.id}`);
    }
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
                Scénarios d'entraînement
              </h1>
              <p className="text-xl text-gray-400">
                Mettez-vous en situation face à des attaques d'ingénierie sociale réalistes
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-emerald-900/30 border border-blue-700/30">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.completed}/{stats.totalScenarios}</div>
                <div className="text-sm text-gray-400">Scénarios complétés</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-emerald-400" />
                <div className="text-3xl font-bold">{stats.completionRate}%</div>
              </div>
              <div className="text-gray-400">Progression</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <div className="text-3xl font-bold">{stats.avgScore}%</div>
              </div>
              <div className="text-gray-400">Score moyen</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-amber-400" />
                <div className="text-3xl font-bold">3-10</div>
              </div>
              <div className="text-gray-400">Min/scénario</div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div className="text-3xl font-bold">42</div>
              </div>
              <div className="text-gray-400">Points d'XP max</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Recommandation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-blue-900/20 to-emerald-900/20 rounded-2xl border border-blue-700/30 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-700/30">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Commencez votre formation</h3>
                  <p className="text-gray-400">
                    Débutez avec un scénario adapté à votre niveau
                  </p>
                </div>
              </div>
              
              <CyberButton
                variant="primary"
                onClick={handleStartRecommended}
                size="lg"
              >
                Scénario recommandé
              </CyberButton>
            </div>
          </div>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="space-y-6">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un scénario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filtres rapides */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-400">Filtrer par :</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {/* Types */}
                <div className="flex flex-wrap gap-2">
                  {scenarioTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedType === type.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {type.icon}
                      {type.label}
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-700/50 rounded">
                        {type.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Difficulté */}
                <div className="flex flex-wrap gap-2">
                  {difficultyLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedDifficulty(level.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDifficulty === level.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>

                {/* Statut */}
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status.id}
                      onClick={() => setSelectedStatus(status.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedStatus === status.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Liste des scénarios */}
        {filteredScenarios.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Scénarios disponibles
                <span className="text-gray-400 text-sm ml-3">
                  ({filteredScenarios.length} résultats)
                </span>
              </h2>
              
              <div className="text-sm text-gray-400">
                {filteredScenarios.filter(s => userProgress.completedScenarios.includes(s.id)).length} complétés
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScenarios.map((scenario, index) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  delay={index * 0.05}
                  compact={true}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Aucun scénario trouvé</h3>
              <p className="text-gray-400 mb-6">
                Aucun scénario ne correspond à vos critères de recherche.
                Essayez de modifier vos filtres.
              </p>
              <CyberButton
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedDifficulty('all');
                  setSelectedStatus('all');
                }}
              >
                Réinitialiser les filtres
              </CyberButton>
            </div>
          </motion.div>
        )}

        {/* Guide des scénarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-6">Comment fonctionnent les scénarios ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-bold mb-3">Apprentissage immersif</h3>
              <p className="text-gray-400 text-sm">
                Plongez dans des situations réalistes qui simulent de vraies attaques
                d'ingénierie sociale.
              </p>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="text-lg font-bold mb-3">Feedback immédiat</h3>
              <p className="text-gray-400 text-sm">
                Recevez des explications détaillées sur vos choix et des conseils
                pour améliorer votre vigilance.
              </p>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-lg font-bold mb-3">Suivi de progression</h3>
              <p className="text-gray-400 text-sm">
                Suivez votre évolution, gagnez des points d'expérience et débloquez
                des niveaux de compétence.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Conseil de sécurité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-2xl border border-blue-800/30 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-700/30">
                  <AlertTriangle className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Pourquoi s'entraîner ?</h3>
                  <p className="text-gray-400">
                    91% des cyberattaques commencent par un email de phishing.
                    L'entraînement régulier réduit de 85% le risque de succès.
                  </p>
                </div>
              </div>
              
              <CyberButton
                variant="outline"
                onClick={() => router.push('/progress')}
              >
                Voir ma progression
              </CyberButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};