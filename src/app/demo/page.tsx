'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play,
  Shield,
  Users,
  BarChart3,
  Zap,
  CheckCircle,
  Sparkles,
  Video,
  Download,
  Mail,
  Phone,
  Lock,
  QrCode
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CyberButton } from '@/components/ui/CyberButton';

export default function DemoPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Simulations de phishing',
      description: 'Des emails réalistes avec analyse détaillée'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Scénarios de vishing',
      description: 'Appels téléphoniques interactifs'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Pretexting & tailgating',
      description: 'Situations en face à face simulées'
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: 'Menaces modernes',
      description: 'QR codes, réseaux sociaux, etc.'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics avancés',
      description: 'Suivi détaillé des progrès'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Gestion d\'équipe',
      description: 'Tableau de bord administrateur'
    }
  ];

  const stats = [
    { value: '85%', label: 'Réduction des incidents' },
    { value: '40%', label: 'Amélioration des scores' },
    { value: '95%', label: 'Satisfaction utilisateurs' },
    { value: '24h', label: 'Mise en place' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-emerald-900/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900/30 to-emerald-900/30 rounded-full border border-blue-700/50 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">Mode démo entreprise</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                SecuritySense Pro
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              La plateforme de formation au social engineering 
              <span className="text-emerald-400 font-semibold"> préférée des entreprises</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <CyberButton
                variant="primary"
                onClick={() => router.push('/scenarios/phishing')}
                icon={<Play className="w-5 h-5" />}
                size="lg"
              >
                Essayer la démo gratuite
              </CyberButton>
              <CyberButton
                variant="outline"
                onClick={() => window.open('#contact', '_self')}
                size="lg"
              >
                Demander une démo personnalisée
              </CyberButton>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Tout ce dont votre entreprise a besoin
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Une plateforme complète pour transformer vos employés en première ligne de défense
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 hover:border-blue-500/50 transition-colors"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-700/30 w-fit mb-6">
                  <div className="text-blue-400">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {['overview', 'scenarios', 'analytics', 'management'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {tab === 'overview' && 'Aperçu'}
                  {tab === 'scenarios' && 'Scénarios'}
                  {tab === 'analytics' && 'Analytics'}
                  {tab === 'management' && 'Gestion'}
                </button>
              ))}
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8"
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Plateforme tout-en-un</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold">Formation interactive</div>
                          <p className="text-gray-400 text-sm">
                            Scénarios réalistes avec feedback immédiat
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold">Analytics détaillés</div>
                          <p className="text-gray-400 text-sm">
                            Suivi des progrès par équipe et individu
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold">Intégrations</div>
                          <p className="text-gray-400 text-sm">
                            Compatible avec vos outils existants
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/20 to-emerald-900/20 rounded-xl p-8 border border-blue-700/30">
                    <div className="aspect-video bg-gray-800/50 rounded-lg flex items-center justify-center">
                      <Video className="w-12 h-12 text-gray-600" />
                    </div>
                    <p className="text-center text-gray-400 mt-4">
                      Démo vidéo disponible
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-12"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-900/30 to-emerald-900/30 rounded-full border border-blue-700/50 mb-6">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300">Prêt à démarrer ?</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transformez votre culture sécurité dès aujourd'hui
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Rejoignez les centaines d'entreprises qui protègent déjà leurs actifs
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CyberButton
                  variant="primary"
                  onClick={() => router.push('/scenarios/phishing')}
                  size="lg"
                >
                  Essayer gratuitement
                </CyberButton>
                <CyberButton
                  variant="outline"
                  onClick={() => window.open('#contact', '_self')}
                  size="lg"
                  icon={<Download className="w-5 h-5" />}
                >
                  Télécharger la brochure
                </CyberButton>
              </div>
              
              <div className="mt-8 text-sm text-gray-500">
                Démo complète • Aucune carte requise • Support dédié
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact (simplifié pour la démo) */}
      <section id="contact" className="py-20 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Contactez-nous</h2>
            <p className="text-xl text-gray-400">
              Discutons de vos besoins en formation sécurité
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-blue-900/30 rounded-xl inline-block mb-4">
                  <Mail className="w-8 h-8 text-blue-400" />
                </div>
                <div className="font-semibold mb-2">Email</div>
                <div className="text-gray-400">contact@securitysense.pro</div>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-emerald-900/30 rounded-xl inline-block mb-4">
                  <Phone className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="font-semibold mb-2">Téléphone</div>
                <div className="text-gray-400">+33 1 23 45 67 89</div>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-purple-900/30 rounded-xl inline-block mb-4">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <div className="font-semibold mb-2">Support</div>
                <div className="text-gray-400">Réponse sous 24h</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}