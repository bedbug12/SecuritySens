'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2,
  Timer,
  Target,
  Trophy,
  Star,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CyberButton } from '@/components/ui/CyberButton';
import { games } from '@/lib/data/games';

export default function GamesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filteredGames = games.filter(game => {
    const matchesSearch = searchTerm === '' || 
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'all' || 
      game.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'facile': return 'text-emerald-400 bg-emerald-400/10';
      case 'moyen': return 'text-amber-400 bg-amber-400/10';
      case 'difficile': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
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
                Jeux d'entraînement
              </h1>
              <p className="text-xl text-gray-400">
                Testez vos connaissances de manière ludique et interactive
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/30">
                <Gamepad2 className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{games.length}</div>
                <div className="text-sm text-gray-400">Jeux disponibles</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-2xl border border-blue-800/30 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-900/30">
                  <Timer className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">3-8 min</div>
                  <div className="text-gray-400">Durée moyenne</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-700/10 rounded-2xl border border-emerald-800/30 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-900/30">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">72%</div>
                  <div className="text-gray-400">Score moyen</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-700/10 rounded-2xl border border-purple-800/30 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-900/30">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">+15</div>
                  <div className="text-gray-400">Badges à débloquer</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un jeu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filtre difficulté */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-2">
                {['all', 'facile', 'moyen', 'difficile'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {diff === 'all' ? 'Tous' : 
                     diff === 'facile' ? 'Facile' :
                     diff === 'moyen' ? 'Moyen' : 'Difficile'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Liste des jeux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
            >
              {/* Effet hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-6">
                {/* En-tête */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/30">
                    {game.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                </div>

                {/* Contenu */}
                <h3 className="text-xl font-bold mb-3">{game.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{game.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-400">{game.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-sm text-gray-400">{game.avgScore}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-emerald-400">
                      {game.completionRate}% réussite
                    </span>
                  </div>
                </div>

                {/* Action */}
                <CyberButton
                  variant="outline"
                  onClick={() => router.push(`/games/${game.id}`)}
                  className="w-full"
                >
                  Jouer maintenant
                </CyberButton>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section bonus */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Améliorez votre score de vigilance</h2>
                <p className="text-gray-400">
                  Jouez régulièrement pour développer des réflexes automatiques face aux menaces
                </p>
              </div>
              <div className="flex gap-4">
                <CyberButton
                  variant="primary"
                  onClick={() => router.push('/games/true-false')}
                >
                  Essayer un jeu rapide
                </CyberButton>
                <CyberButton
                  variant="ghost"
                  onClick={() => router.push('/progress')}
                >
                  Voir ma progression
                </CyberButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}