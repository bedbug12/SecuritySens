'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Smartphone, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Eye,
  Clock,
  Download,
  ExternalLink
} from 'lucide-react';
import { AlertBadge } from '@/components/ui/AlertBadge';
import { ConsequenceDisplay } from '@/components/feedback/ConsequenceDisplay';

interface QRCodeScannerProps {
  scenario: {
    [x: string]: any;
    id: string;
    title: string;
    qrCode: {
      context: {
        location: string;
        appearance: string;
        message: string;
      };
      scanResult: {
        url: string;
        permissions: string[];
        legitimacy: boolean;
        redirectsTo?: string;
        asksFor?: string[];
      };
    };
    redFlags: Array<{
      type: 'location' | 'appearance' | 'message' | 'url' | 'permissions';
      description: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    correctAction: 'scan' | 'ignore' | 'report' | 'verify';
    
  };
  onComplete: (score: number, action: string) => void;
}

export function QRCodeScanner({ scenario, onComplete}: QRCodeScannerProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [observations, setObservations] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedAction) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [selectedAction]);

  const handleObservation = (observation: string) => {
    if (!observations.includes(observation)) {
      setObservations([...observations, observation]);
    }
  };

  const simulateScan = () => {
    setScanning(true);
    
    // Simulation du processus de scan
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
    }, 2000);
  };

  const handleAction = (action: string) => {
    setSelectedAction(action);
    
    // Calcul du score
    let calculatedScore = 0;
    
    if (action === scenario.correctAction) {
      calculatedScore = 100;
    } else {
      calculatedScore = 50;
    }
    
    // Bonus pour les observations
    const observationBonus = observations.length * 10;
    calculatedScore += observationBonus;
    
    // Bonus pour le temps de réflexion
    const timeBonus = Math.min(30, Math.floor(timeSpent / 3));
    calculatedScore += timeBonus;
    
    setScore(calculatedScore);
    
    // Afficher l'analyse après un délai
    setTimeout(() => {
      setShowAnalysis(true);
      scenario.onComplete(calculatedScore, action);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isSuspiciousElement = (element: string) => {
    const suspiciousElements = [
      'collé', 'adhésif', 'amateur', 'non officiel', 
      'gagner', 'cadeau', 'urgent', 'gratuit'
    ];
    return suspiciousElements.some(suspicious => 
      element.toLowerCase().includes(suspicious)
    );
  };

  return (
    <div className="space-y-6">
      {/* Scenario Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{scenario.title}</h2>
            <p className="text-gray-400">Que feriez-vous face à ce QR code ?</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">{formatTime(timeSpent)}</span>
          </div>
        </div>
      </motion.div>

      {/* QR Code Scene */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Scene */}
          <div className="space-y-6">
            <div className="relative bg-gray-950 rounded-xl p-6 min-h-[400px]">
              {/* Parking scene */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Car */}
                <div className="relative mb-12">
                  <div className="w-64 h-32 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg"></div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-48 h-32 bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-lg"></div>
                  </div>
                  
                  {/* QR Code on windshield */}
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15 
                    }}
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="relative">
                      <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-2xl">
                        {/* QR Code pattern */}
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-gray-100 relative overflow-hidden">
                          {/* QR Code simulated pattern */}
                          <div className="absolute inset-4 bg-black rounded-lg"></div>
                          <div className="absolute top-2 left-2 w-6 h-6 bg-black rounded-lg"></div>
                          <div className="absolute top-2 right-2 w-6 h-6 bg-black rounded-lg"></div>
                          <div className="absolute bottom-2 left-2 w-6 h-6 bg-black rounded-lg"></div>
                          <div className="absolute inset-8 bg-white"></div>
                          
                          {/* Scanning effect */}
                          {scanning && (
                            <motion.div
                              initial={{ y: -20 }}
                              animate={{ y: "100%" }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                              className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent"
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Sticky note effect */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rotate-12"></div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Message */}
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
                    <p className="text-yellow-300 text-sm font-medium">
                      "{scenario.qrCode.context.message}"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Location indicator */}
              <div className="absolute bottom-4 left-4">
                <AlertBadge 
                  type="info" 
                  message={`Lieu: ${scenario.qrCode.context.location}`}
                  size="sm"
                />
              </div>
            </div>
            
            {/* Observations */}
            <div>
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-400" />
                Éléments à observer
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'appearance', text: `Apparence: ${scenario.qrCode.context.appearance}` },
                  { id: 'location', text: `Position: ${scenario.qrCode.context.location}` },
                  { id: 'message', text: `Message: ${scenario.qrCode.context.message}` },
                  { id: 'sticky', text: 'Collé avec de l\'adhésif bon marché' }
                ].map((item) => {
                  const isSuspicious = isSuspiciousElement(item.text);
                  const isObserved = observations.includes(item.id);
                  
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: isObserved ? 1 : 1.02 }}
                      whileTap={{ scale: isObserved ? 1 : 0.98 }}
                      onClick={() => handleObservation(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isObserved
                          ? isSuspicious
                            ? 'border-red-400/50 bg-red-400/5'
                            : 'border-blue-400/50 bg-blue-400/5'
                          : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isObserved
                            ? isSuspicious
                              ? 'bg-red-400/20'
                              : 'bg-blue-400/20'
                            : 'bg-gray-700'
                        }`}>
                          {isObserved ? (
                            isSuspicious ? (
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                            ) : (
                              <CheckCircle className="w-3 h-3 text-blue-400" />
                            )
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                          )}
                        </div>
                        <span className={isObserved && isSuspicious ? 'text-red-300' : 'text-gray-300'}>
                          {item.text}
                        </span>
                      </div>
                      
                      {isObserved && isSuspicious && (
                        <p className="text-xs text-red-400 mt-2 ml-9">
                          Élément suspect détecté
                        </p>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Right side - Scan results */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-blue-400" />
                Scan du QR code
              </h3>
              
              <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                <p className="text-gray-300 mb-4">
                  Que se passe-t-il si vous scannez ce QR code ?
                </p>
                
                <button
                  onClick={simulateScan}
                  disabled={scanning || scanComplete}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                    scanning
                      ? 'bg-blue-600 cursor-wait'
                      : scanComplete
                      ? 'bg-gray-700 cursor-default'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90'
                  }`}
                >
                  {scanning ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Analyse en cours...
                    </>
                  ) : scanComplete ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Scan terminé
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5" />
                      Simuler le scan
                    </>
                  )}
                </button>
              </div>
              
              {/* Scan results */}
              <AnimatePresence>
                {scanComplete && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-xl p-6 border border-blue-800/30">
                      <h4 className="font-bold mb-4 flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-blue-400" />
                        Résultat du scan
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">URL détectée :</div>
                          <div className="p-3 bg-gray-900/50 rounded-lg font-mono text-sm break-all">
                            {scenario.qrCode.scanResult.url}
                          </div>
                        </div>
                        
                        {scenario.qrCode.scanResult.redirectsTo && (
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Redirige vers :</div>
                            <div className="p-3 bg-gray-900/50 rounded-lg font-mono text-sm break-all">
                              {scenario.qrCode.scanResult.redirectsTo}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Permissions demandées :</div>
                          <div className="space-y-2">
                            {scenario.qrCode.scanResult.permissions.map((permission, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-900/30 rounded">
                                <div className={`w-2 h-2 rounded-full ${
                                  permission.includes('contacts') || 
                                  permission.includes('location') ||
                                  permission.includes('camera')
                                    ? 'bg-red-400'
                                    : 'bg-emerald-400'
                                }`} />
                                <span className={`
                                  ${permission.includes('contacts') || 
                                    permission.includes('location') ||
                                    permission.includes('camera')
                                      ? 'text-red-300'
                                      : 'text-gray-300'}
                                `}>
                                  {permission}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${
                          scenario.qrCode.scanResult.legitimacy
                            ? 'bg-emerald-400/10 border border-emerald-400/30'
                            : 'bg-red-400/10 border border-red-400/30'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            {scenario.qrCode.scanResult.legitimacy ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                            <div className="font-medium">
                              {scenario.qrCode.scanResult.legitimacy 
                                ? 'Site légitime' 
                                : 'Site potentiellement malveillant'}
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">
                            {scenario.qrCode.scanResult.legitimacy
                              ? 'Ce site semble officiel et sécurisé'
                              : 'Attention : ce site demande des permissions excessives'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Observations counter */}
            <div className="text-center p-6 bg-gray-800/30 rounded-xl">
              <div className="text-sm text-gray-400 mb-2">Observations notées</div>
              <div className="text-3xl font-bold text-emerald-400">
                {observations.length}/4
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Chaque observation rapporte +10 points
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      {!selectedAction && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { 
              id: 'scan', 
              label: 'Scanner', 
              description: 'Scanner le QR code pour voir',
              color: 'from-blue-600 to-cyan-600',
              icon: <QrCode className="w-6 h-6" />
            },
            { 
              id: 'ignore', 
              label: 'Ignorer', 
              description: 'Ne pas scanner et passer son chemin',
              color: 'from-gray-600 to-gray-700',
              icon: <XCircle className="w-6 h-6" />
            },
            { 
              id: 'report', 
              label: 'Signaler', 
              description: 'Signaler à la sécurité',
              color: 'from-red-600 to-orange-600',
              icon: <AlertTriangle className="w-6 h-6" />
            },
            { 
              id: 'verify', 
              label: 'Vérifier', 
              description: 'Contacter la communication interne',
              color: 'from-emerald-600 to-green-600',
              icon: <Shield className="w-6 h-6" />
            }
          ].map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action.id)}
              className={`p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all bg-gradient-to-br ${action.color} text-white text-left`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold">{action.label}</div>
                {action.icon}
              </div>
              <p className="text-sm opacity-90 mb-4">{action.description}</p>
              <div className="text-xs opacity-75">
                Sélectionner cette action
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Score Display */}
      {selectedAction && score !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center p-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              {score}/100
            </div>
            <div className="text-gray-400 mb-4">Score obtenu</div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Observations</div>
                <div className="text-xl font-bold text-emerald-400">
                  +{observations.length * 10}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Temps</div>
                <div className="text-xl font-bold text-blue-400">
                  +{Math.min(30, Math.floor(timeSpent / 3))}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Action</div>
                <div className="text-xl font-bold text-purple-400">
                  {selectedAction === scenario.correctAction ? '+100' : '+50'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analysis */}
      <AnimatePresence>
        {showAnalysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <ConsequenceDisplay
              userAction={selectedAction!}
              correctAction={scenario.correctAction}
              scenarioType="qr"
            />
            
            {/* QR Code Security Guidelines */}
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/10 rounded-2xl border border-blue-800/30 p-6">
              <h3 className="text-xl font-bold mb-4">📱 Sécurité des QR codes</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Vérifiez l'origine</div>
                    <p className="text-sm text-gray-400">
                      Ne scannez jamais de QR codes dont vous ne connaissez pas l'origine
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Prévisualisez l'URL</div>
                    <p className="text-sm text-gray-400">
                      Utilisez un scanner qui montre l'URL avant d'ouvrir le lien
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Méfiez-vous des permissions</div>
                    <p className="text-sm text-gray-400">
                      Refusez les demandes de permissions excessives (contacts, localisation, caméra)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <div className="font-medium">Signalez les QR codes suspects</div>
                    <p className="text-sm text-gray-400">
                      Informez votre équipe sécurité de tout QR code suspect dans l'entreprise
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}