// app/page.tsx (landing page modifiée)
'use client';

import { motion } from 'framer-motion';
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
  CheckCircle,
  LogIn
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { useNotification } from '@/components/feedback/NotificationProvider';
import { useSession } from 'next-auth/react';
import { Navigation } from '@/components/layout/Navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { data: session, status } = useSession();

  const stats = {
    totalUsers: 1247,
    attacksPrevented: 8942,
    avgScoreIncrease: 42,
    completionRate: 78,
  };

  // Si l'utilisateur est connecté, rediriger vers le dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Afficher un loading pendant la vérification
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si connecté, ne pas afficher la landing page (sera redirigé)
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Redirection vers votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Seulement les utilisateurs non connectés voient la landing page
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Scénarios réalistes',
      description: 'Basés sur des attaques du monde réel',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Feedback immédiat',
      description: 'Analyse détaillée de vos décisions',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Progression suivie',
      description: 'Suivez votre amélioration',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Badges et certifications',
      description: 'Valorisez vos compétences',
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10'
    },
  ];

  const threatTypes = [
    { 
      icon: <MailWarning className="w-6 h-6" />, 
      name: 'Phishing', 
      percentage: 65,
      description: 'Emails frauduleux',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: <PhoneCall className="w-6 h-6" />, 
      name: 'Vishing', 
      percentage: 20,
      description: 'Appels téléphoniques',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: <UserCheck className="w-6 h-6" />, 
      name: 'Pretexting', 
      percentage: 10,
      description: 'Usurpation d\'identité',
      color: 'from-amber-500 to-orange-500'
    },
    { 
      icon: <QrCode className="w-6 h-6" />, 
      name: 'QR Codes', 
      percentage: 5,
      description: 'Codes malveillants',
      color: 'from-emerald-500 to-green-500'
    },
  ];

  const handleGetStarted = () => {
    showNotification('🎯 Direction la page d\'inscription', 'info');
    router.push('/auth/signup');
  };

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  const handleDemo = () => {
    showNotification('🎮 Mode démo activé', 'info');
    router.push('/demo');
  };

  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent" />
      </div>

      {/* Navigation simplifiée pour landing page */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-700/30">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                SecuritySense
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <CyberButton
                variant="outline"
                onClick={handleSignIn}
                icon={<LogIn className="w-5 h-5" />}
                size="sm"
              >
                Se connecter
              </CyberButton>
              <CyberButton
                variant="primary"
                onClick={handleGetStarted}
                size="sm"
              >
                Commencer gratuitement
              </CyberButton>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-24">
        {/* Hero Section */}
        <section className="relative py-12 md:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-full border border-blue-700/50 mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">Nouvelle Plateforme</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Transformez vos équipes en
              <span className="block bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                experts en sécurité
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Protégez votre entreprise contre les attaques d'ingénierie sociale avec 
              <span className="text-emerald-400 font-semibold"> des simulations interactives</span> et 
              <span className="text-blue-400 font-semibold"> une formation personnalisée</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <CyberButton
                variant="primary"
                onClick={handleGetStarted}
                icon={<Play className="w-5 h-5" />}
                size="lg"
                className="group"
                glow
              >
                Commencer gratuitement
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </CyberButton>
              
              <CyberButton
                variant="outline"
                onClick={handleDemo}
                icon={<BookOpen className="w-5 h-5" />}
                size="lg"
              >
                Voir la démo
              </CyberButton>
            </div>
            
            {/* Stats Hero */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-12"
            >
              {[
                { value: `${stats.attacksPrevented}+`, label: 'Attaques prévenues', icon: <Shield /> },
                { value: `${stats.totalUsers}+`, label: 'Experts formés', icon: <Users /> },
                { value: `${stats.avgScoreIncrease}%`, label: 'Amélioration score', icon: <BarChart3 /> },
                { value: `${stats.completionRate}%`, label: 'Taux de réussite', icon: <Star /> },
              ].map((stat, idx) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Pourquoi choisir SecuritySense */}
        <section className="mb-16 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              La formation cybersécurité
              <span className="block text-emerald-400">la plus engageante</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Dites adieu aux formations ennuyeuses, bonjour à l'apprentissage interactif
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className={`${feature.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <div className={feature.color}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Types de Menaces */}
        <section className="mb-16 py-12 bg-gradient-to-b from-transparent to-gray-900/30 rounded-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Menaces que nous couvrons</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              91% des cyberattaques commencent par de l'ingénierie sociale
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {threatTypes.map((threat, index) => (
              <motion.div
                key={threat.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    {threat.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{threat.name}</h3>
                    <div className="text-sm text-gray-500">{threat.description}</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Prévalence</span>
                    <span className="font-bold">{threat.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${threat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      viewport={{ once: true }}
                      className={`h-full bg-gradient-to-r ${threat.color}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="mb-16 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              3 étapes simples pour devenir un expert
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Créez votre compte',
                description: 'Inscrivez-vous en 30 secondes, aucune carte bancaire requise',
                icon: <UserCheck className="w-8 h-8" />,
                color: 'text-blue-400'
              },
              {
                step: '02',
                title: 'Passez des scénarios',
                description: 'Affrontez des simulations basées sur des attaques réelles',
                icon: <Target className="w-8 h-8" />,
                color: 'text-emerald-400'
              },
              {
                step: '03',
                title: 'Devenez expert',
                description: 'Suivez votre progression et obtenez des certifications',
                icon: <Award className="w-8 h-8" />,
                color: 'text-purple-400'
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${item.color} bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 text-2xl font-bold mb-6`}>
                  {item.step}
                </div>
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 ${item.color}`}>
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Témoignages */}
        <section className="mb-16 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des entreprises de toutes tailles protègent déjà leurs équipes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Nos équipes sont 85% plus vigilantes après seulement 2 semaines de formation.",
                author: "Sarah Martin",
                role: "Responsable Sécurité IT",
                company: "TechCorp"
              },
              {
                quote: "La plateforme la plus intuitive que nous ayons utilisée. Les employés adorent !",
                author: "Marc Dubois",
                role: "Directeur des Opérations",
                company: "DataSecure"
              },
              {
                quote: "Réduction de 90% des incidents de phishing dans les 3 premiers mois.",
                author: "Julie Chen",
                role: "CISO",
                company: "FinancePlus"
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</div>
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
          className="py-12"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Prêt à transformer votre entreprise ?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Rejoignez les centaines d'entreprises qui protègent déjà leurs données sensibles
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <CyberButton
                  variant="primary"
                  onClick={handleGetStarted}
                  size="lg"
                  icon={<Zap className="w-5 h-5" />}
                  glow
                >
                  Commencer gratuitement
                </CyberButton>
                
                <CyberButton
                  variant="outline"
                  onClick={handleDemo}
                  size="lg"
                >
                  Demander une démo entreprise
                </CyberButton>
              </div>
              
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {[
                  { label: 'Aucune carte requise', icon: <CheckCircle className="w-4 h-4" /> },
                  { label: 'Configuration 5min', icon: <Clock className="w-4 h-4" /> },
                  { label: 'Support 24/7', icon: <Users className="w-4 h-4" /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm text-gray-500">
                    {item.icon}
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-8 border-t border-gray-800 mt-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-700/30">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-lg font-bold">SecuritySense</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <button className="hover:text-gray-300 transition-colors">
                Conditions d'utilisation
              </button>
              <button className="hover:text-gray-300 transition-colors">
                Confidentialité
              </button>
              <button className="hover:text-gray-300 transition-colors">
                Contact
              </button>
            </div>
          </div>
          <div className="text-center text-sm text-gray-600 mt-8">
            © 2024 SecuritySense. Tous droits réservés.
          </div>
        </footer>
      </div>
    </div>
  );
}