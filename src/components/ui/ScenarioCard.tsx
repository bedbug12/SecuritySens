'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  Target, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Play,
  Lock,
  Mail,
  Phone,
  User,
  QrCode
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/lib/contexts/ProgressContext';

interface ScenarioCardProps {
  scenario: {
    id: string;
    title: string;
    description: string;
    type: 'phishing' | 'vishing' | 'pretexting' | 'tailgating' | 'qr';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: number;
    completionRate?: number;
  };
  delay?: number;
  compact?: boolean;
}

const ScenarioCard = ({ scenario, delay = 0, compact = false }: ScenarioCardProps) => {
  const router = useRouter();
  const { userProgress } = useProgress();
  
  const isCompleted = userProgress.completedScenarios.includes(scenario.id);
  
  const getTypeIcon = () => {
    switch(scenario.type) {
      case 'phishing': return <Mail className="w-5 h-5" />;
      case 'vishing': return <Phone className="w-5 h-5" />;
      case 'pretexting': return <User className="w-5 h-5" />;
      case 'tailgating': return <Lock className="w-5 h-5" />;
      case 'qr': return <QrCode className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };
  
  const getTypeColor = () => {
    switch(scenario.type) {
      case 'phishing': return 'text-blue-400 bg-blue-400/10';
      case 'vishing': return 'text-purple-400 bg-purple-400/10';
      case 'pretexting': return 'text-amber-400 bg-amber-400/10';
      case 'tailgating': return 'text-emerald-400 bg-emerald-400/10';
      case 'qr': return 'text-pink-400 bg-pink-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };
  
  const getDifficultyColor = () => {
    switch(scenario.difficulty) {
      case 'beginner': return 'text-emerald-400 bg-emerald-400/10';
      case 'intermediate': return 'text-amber-400 bg-amber-400/10';
      case 'advanced': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const handleClick = () => {
    router.push(`/scenarios/${scenario.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className={`group relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 hover:border-blue-500/50 overflow-hidden cursor-pointer transition-all duration-300 ${compact ? 'p-4' : 'p-6'}`}
      onClick={handleClick}
    >
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${getTypeColor()}`}>
            {getTypeIcon()}
          </div>
          <div>
            <h3 className={`font-bold ${compact ? 'text-lg' : 'text-xl'} mb-1`}>
              {scenario.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
                {scenario.difficulty === 'beginner' ? 'Débutant' :
                 scenario.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
              </span>
              {isCompleted && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-400">
                  ✓ Terminé
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
          <Play className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
        </button>
      </div>
      
      {/* Description */}
      {!compact && (
        <p className="text-gray-400 mb-6 line-clamp-2">
          {scenario.description}
        </p>
      )}
      
      {/* Footer */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{scenario.estimatedTime} min</span>
          </div>
          
          {scenario.completionRate && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Target className="w-4 h-4" />
              <span>{scenario.completionRate}% réussite</span>
            </div>
          )}
        </div>
        
        {isCompleted ? (
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        )}
      </div>
      
      {/* Progress bar for completed scenarios */}
      {isCompleted && (
        <div className="mt-4">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export { ScenarioCard };