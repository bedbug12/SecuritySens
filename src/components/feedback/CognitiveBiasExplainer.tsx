'use client';

import { motion } from 'framer-motion';
import { 
  Brain, 
  AlertTriangle, 
  Target,
  Clock,
  Users,
  Shield
} from 'lucide-react';

interface CognitiveBiasExplainerProps {
  biases: string[];
}

export function CognitiveBiasExplainer({ biases }: CognitiveBiasExplainerProps) {
  
  const biasDetails: Record<string, {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    example: string;
    defense: string;
  }> = {
    'Autorité': {
      title: 'Biais d\'Autorité',
      description: 'Tendance à obéir aux figures d\'autorité sans les remettre en question',
      icon: <Users className="w-6 h-6" />,
      color: 'text-purple-400 bg-purple-400/10',
      example: 'Un email prétendant venir du PDG demande un virement urgent',
      defense: 'Vérifiez toujours l\'identité, même pour les supérieurs hiérarchiques'
    },
    'Urgence': {
      title: 'Biais d\'Urgence',
      description: 'Tendance à prendre des décisions hâtives sous pression temporelle',
      icon: <Clock className="w-6 h-6" />,
      color: 'text-red-400 bg-red-400/10',
      example: 'Une demande doit être traitée "dans l\'heure" sous peine de pénalités',
      defense: 'Prenez toujours le temps de vérifier, les vraies urgences permettent la vérification'
    },
    'Confiance': {
      title: 'Biais de Confiance',
      description: 'Tendance à faire confiance trop facilement à des sources familières',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-blue-400 bg-blue-400/10',
      example: 'Un email semble venir d\'un collègue connu',
      defense: 'Vérifiez l\'adresse complète, pas seulement le nom affiché'
    },
    'Preuve sociale': {
      title: 'Preuve Sociale',
      description: 'Tendance à suivre le comportement des autres',
      icon: <Users className="w-6 h-6" />,
      color: 'text-emerald-400 bg-emerald-400/10',
      example: 'Tout le monde semble faire confiance à cette personne',
      defense: 'Basez vos décisions sur les faits, pas sur le comportement des autres'
    },
    'Réciprocité': {
      title: 'Réciprocité',
      description: 'Tendance à vouloir rendre la pareille',
      icon: <Target className="w-6 h-6" />,
      color: 'text-amber-400 bg-amber-400/10',
      example: 'On vous offre un cadeau puis demande une faveur',
      defense: 'Les faveurs professionnelles ne doivent pas être conditionnées par des cadeaux'
    },
    'Engagement': {
      title: 'Engagement et Cohérence',
      description: 'Tendance à vouloir rester cohérent avec ses engagements passés',
      icon: <Brain className="w-6 h-6" />,
      color: 'text-pink-400 bg-pink-400/10',
      example: 'Après avoir donné quelques informations, on vous en demande de plus sensibles',
      defense: 'Reconnaissez qu\'il est acceptable de changer d\'avis face à de nouvelles informations'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400/10 to-pink-400/10">
          <Brain className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Biais cognitifs exploités</h3>
          <p className="text-gray-400">Comprenez comment les attaquants manipulent votre pensée</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {biases.map((bias, index) => {
          const details = biasDetails[bias];
          if (!details) return null;
          
          return (
            <motion.div
              key={bias}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${details.color}`}>
                  {details.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">{details.title}</h4>
                  <p className="text-sm text-gray-400">{details.description}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <div className="font-medium text-sm">Exemple dans ce scénario</div>
                  </div>
                  <p className="text-sm text-gray-300">{details.example}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <div className="font-medium text-sm">Comment se défendre</div>
                  </div>
                  <p className="text-sm text-gray-300">{details.defense}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* General Advice */}
      <div className="mt-8 pt-8 border-t border-gray-800">
        <h4 className="text-lg font-bold mb-4">🛡️ Stratégies de défense cognitive</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div>
              <div className="font-medium">Prenez du recul</div>
              <p className="text-sm text-gray-400">
                Quand une demande semble urgente ou inhabituelle, marquez une pause avant d'agir
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div>
              <div className="font-medium">Vérifiez systématiquement</div>
              <p className="text-sm text-gray-400">
                Utilisez des canaux de communication alternatifs pour confirmer les identités
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div>
              <div className="font-medium">Soyez conscient des biais</div>
              <p className="text-sm text-gray-400">
                La simple conscience de ces biais réduit considérablement leur influence
              </p>
            </div>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}