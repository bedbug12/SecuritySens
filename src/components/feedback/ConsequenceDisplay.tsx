'use client';

import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Shield,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface ConsequenceDisplayProps {
  userAction: string;
  correctAction: string;
  scenarioType: 'phishing' | 'vishing' | 'pretexting' | 'tailgating' | 'qr';
  score?: number;
}

export function ConsequenceDisplay({ 
  userAction, 
  correctAction, 
  scenarioType,
  score 
}: ConsequenceDisplayProps) {
  
  const isCorrect = userAction === correctAction;
  
  const getScenarioTitle = () => {
    switch(scenarioType) {
      case 'phishing': return 'Email de phishing';
      case 'vishing': return 'Appel téléphonique frauduleux';
      case 'pretexting': return 'Prétexting';
      case 'tailgating': return 'Tailgating';
      case 'qr': return 'QR code malveillant';
      default: return 'Scénario de sécurité';
    }
  };
  
  const getConsequences = () => {
    const consequences = {
      phishing: {
        report: {
          title: 'Excellent choix !',
          description: 'Vous avez signalé l\'email suspect à l\'équipe sécurité.',
          impact: 'Impact positif : L\'attaque a été neutralisée et l\'équipe sécurité a pu analyser la menace.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        },
        delete: {
          title: 'Risque modéré',
          description: 'Vous avez supprimé l\'email.',
          impact: 'Impact neutre : La menace immédiate est évitée, mais l\'équipe sécurité n\'a pas été informée.',
          icon: <AlertTriangle className="w-8 h-8 text-amber-400" />
        },
        ignore: {
          title: 'Risque élevé',
          description: 'Vous avez ignoré l\'email.',
          impact: 'Impact négatif : L\'attaquant peut réessayer ou cibler d\'autres collègues.',
          icon: <XCircle className="w-8 h-8 text-red-400" />
        },
        verify: {
          title: 'Bonne pratique',
          description: 'Vous avez vérifié auprès de l\'expéditeur légitime.',
          impact: 'Impact positif : Vous avez confirmé la tentative d\'attaque et protégé l\'entreprise.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        }
      },
      vishing: {
        verify: {
          title: 'Procédure correcte',
          description: 'Vous avez demandé une vérification d\'identité.',
          impact: 'Impact positif : L\'attaquant a été démasqué et la tentative documentée.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        },
        decline: {
          title: 'Réaction appropriée',
          description: 'Vous avez raccroché poliment.',
          impact: 'Impact positif : Vous avez coupé court à l\'attaque sans engager la conversation.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        },
        transfer: {
          title: 'Risque modéré',
          description: 'Vous avez transféré l\'appel.',
          impact: 'Impact neutre : Vous avez évité de traiter la demande, mais avez potentiellement exposé un collègue.',
          icon: <AlertTriangle className="w-8 h-8 text-amber-400" />
        },
        report: {
          title: 'Excellente initiative',
          description: 'Vous avez signalé l\'appel suspect.',
          impact: 'Impact positif : L\'équipe sécurité a été alertée et peut mettre en place des contre-mesures.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        }
      },
      tailgating: {
        deny: {
          title: 'Strict et sécurisé',
          description: 'Vous avez refusé l\'accès.',
          impact: 'Impact positif : Vous avez empêché une intrusion potentielle dans les locaux.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        },
        verify: {
          title: 'Procédure idéale',
          description: 'Vous avez contacté la sécurité.',
          impact: 'Impact positif : La personne a été identifiée et traitée selon les procédures.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        },
        escort: {
          title: 'Compromis acceptable',
          description: 'Vous avez escorté la personne.',
          impact: 'Impact neutre : Vous avez surveillé la personne, mais avez pris un risque.',
          icon: <AlertTriangle className="w-8 h-8 text-amber-400" />
        },
        allow: {
          title: 'Risque élevé',
          description: 'Vous avez autorisé l\'accès.',
          impact: 'Impact négatif : Vous avez potentiellement laissé entrer un intrus dans les locaux.',
          icon: <XCircle className="w-8 h-8 text-red-400" />
        }
      },
      pretexting: {
        verify: {
          title: 'Procédure correcte',
          description: 'Vous avez vérifié l\'identité de la personne.',
          impact: 'Impact positif : Vous avez déjoué la tentative d\'usurpation d\'identité.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        },
        decline: {
          title: 'Réaction appropriée',
          description: 'Vous avez refusé la demande suspecte.',
          impact: 'Impact positif : Vous avez protégé les informations sensibles de l\'entreprise.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        },
        report: {
          title: 'Excellente initiative',
          description: 'Vous avez signalé la tentative de prétexting.',
          impact: 'Impact positif : L\'équipe sécurité peut analyser et contrer cette technique.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        },
        redirect: {
          title: 'Réaction appropriée',
          description: 'Vous avez redirigé vers le service concerné.',
          impact: 'Impact neutre : Vous avez évité de traiter directement, mais avez conservé une trace.',
          icon: <AlertTriangle className="w-8 h-8 text-amber-400" />
        }
      },
      qr: {
        ignore: {
          title: 'Bonne réaction',
          description: 'Vous avez ignoré le QR code suspect.',
          impact: 'Impact positif : Vous avez évité une infection potentielle par malware.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        },
        report: {
          title: 'Excellente initiative',
          description: 'Vous avez signalé le QR code suspect.',
          impact: 'Impact positif : L\'équipe sécurité peut l\'analyser et le retirer.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        },
        verify: {
          title: 'Approche prudente',
          description: 'Vous avez vérifié l\'origine du QR code.',
          impact: 'Impact positif : Vous avez confirmé la menace potentielle.',
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />
        },
        scan: {
          title: 'Risque élevé',
          description: 'Vous avez scanné le QR code.',
          impact: 'Impact négatif : Vous avez potentiellement exposé votre appareil à une menace.',
          icon: <XCircle className="w-8 h-8 text-red-400" />
        }
      }
    };
    
    // Vérifier si le type de scénario existe dans l'objet
    const scenarioConsequences = consequences[scenarioType];
    if (!scenarioConsequences) {
      return {
        title: 'Action évaluée',
        description: 'Votre action a été analysée.',
        impact: 'Conséquences à déterminer.',
        icon: <Shield className="w-8 h-8 text-blue-400" />
      };
    }
    
    // Vérifier si l'action utilisateur existe dans le scénario
    const userActionConsequence = scenarioConsequences[userAction as keyof typeof scenarioConsequences];
    if (!userActionConsequence) {
      return {
        title: 'Action évaluée',
        description: 'Votre action a été analysée.',
        impact: 'Conséquences à déterminer.',
        icon: <Shield className="w-8 h-8 text-blue-400" />
      };
    }
    
    return userActionConsequence;
  };
  
  const consequences = getConsequences();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Analyse de vos actions</h3>
          <p className="text-gray-400">{getScenarioTitle()}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {isCorrect ? (
            <div className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-sm font-medium">
              ✓ Bonne décision
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-sm font-medium">
              ⚠️ À améliorer
            </div>
          )}
        </div>
      </div>

      {/* Result Card */}
      <div className={`rounded-xl p-6 mb-8 ${
        isCorrect 
          ? 'bg-emerald-400/5 border border-emerald-400/20'
          : userAction === 'ignore' || userAction === 'allow' || userAction === 'scan'
          ? 'bg-red-400/5 border border-red-400/20'
          : 'bg-amber-400/5 border border-amber-400/20'
      }`}>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gray-800/50">
            {consequences.icon}
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-bold mb-2">{consequences.title}</h4>
            <p className="text-gray-300 mb-4">{consequences.description}</p>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="font-medium mb-2">Impact sur la sécurité :</div>
              <p className="text-gray-300">{consequences.impact}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <div className="font-medium">Votre action</div>
          </div>
          <div className="text-2xl font-bold mb-2 capitalize">{userAction}</div>
          <p className="text-gray-400 text-sm">
            Vous avez choisi de {userAction} dans cette situation
          </p>
        </div>
        
        <div className="bg-gray-800/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <div className="font-medium">Action recommandée</div>
          </div>
          <div className="text-2xl font-bold mb-2 capitalize">{correctAction}</div>
          <p className="text-gray-400 text-sm">
            La procédure sécurité recommande de {correctAction} dans ce type de situation
          </p>
        </div>
      </div>

      {/* Score Impact */}
      {score !== undefined && (
        <div className="bg-gradient-to-r from-blue-900/20 to-emerald-900/20 rounded-xl p-6 border border-blue-800/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-amber-400" />
              )}
              <div>
                <div className="font-bold">Impact sur votre score</div>
                <div className="text-sm text-gray-400">Évaluation de votre décision</div>
              </div>
            </div>
            
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              {score}/100
            </div>
          </div>
          
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              className={`h-full ${
                score >= 80 ? 'bg-emerald-500' :
                score >= 60 ? 'bg-blue-500' :
                'bg-amber-500'
              }`}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>À améliorer</span>
            <span>Moyen</span>
            <span>Bon</span>
            <span>Excellent</span>
          </div>
        </div>
      )}

      {/* Learning Point */}
      <div className="mt-8 pt-8 border-t border-gray-800">
        <h4 className="text-lg font-bold mb-4">📚 Point d'apprentissage</h4>
        <p className="text-gray-300">
          {isCorrect 
            ? 'Vous avez appliqué les bonnes pratiques de sécurité. Continuez à maintenir ce niveau de vigilance !'
            : 'Analysez pourquoi la réponse recommandée est plus sûre. Chaque situation vous apprend à mieux réagir.'
          }
        </p>
      </div>
    </motion.div>
  );
}