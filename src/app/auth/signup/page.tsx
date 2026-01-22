'use client';
export const runtime = 'nodejs';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');
  const [strengthColor, setStrengthColor] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
    newsletter: true
  });

  // Vérifier la force du mot de passe
  useEffect(() => {
    const calculatePasswordStrength = (password: string) => {
      let score = 0;
      
      // Longueur
      if (password.length >= 8) score += 20;
      if (password.length >= 12) score += 20;
      
      // Complexité
      if (/[A-Z]/.test(password)) score += 20; // Majuscule
      if (/[a-z]/.test(password)) score += 20; // Minuscule
      if (/[0-9]/.test(password)) score += 20; // Chiffre
      if (/[^A-Za-z0-9]/.test(password)) score += 20; // Caractère spécial
      
      setStrength(score);
      
      // Définir le label et la couleur
      if (score >= 80) {
        setStrengthLabel('Fort');
        setStrengthColor('from-emerald-400 to-green-400');
      } else if (score >= 60) {
        setStrengthLabel('Moyen');
        setStrengthColor('from-amber-400 to-yellow-400');
      } else if (score >= 20) {
        setStrengthLabel('Faible');
        setStrengthColor('from-red-400 to-orange-400');
      } else {
        setStrengthLabel('Très faible');
        setStrengthColor('from-gray-400 to-gray-600');
      }
    };
    
    if (formData.password) {
      calculatePasswordStrength(formData.password);
    } else {
      setStrength(0);
      setStrengthLabel('');
      setStrengthColor('');
    }
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (!formData.terms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      setIsLoading(false);
      return;
    }

    if (strength < 60) {
      setError('Votre mot de passe est trop faible');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          newsletter: formData.newsletter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setSuccess('Compte créé avec succès ! Redirection...');
      
      // Connexion automatique
      setTimeout(async () => {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          router.push('/auth/signin?registered=true');
        } else {
          router.push('/dashboard');
        }
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = (provider: string) => {
    signIn(provider, { callbackUrl: '/dashboard' });
  };

  const passwordRequirements = [
    { id: 'length', label: 'Minimum 8 caractères', met: formData.password.length >= 8 },
    { id: 'uppercase', label: 'Une majuscule', met: /[A-Z]/.test(formData.password) },
    { id: 'lowercase', label: 'Une minuscule', met: /[a-z]/.test(formData.password) },
    { id: 'number', label: 'Un chiffre', met: /[0-9]/.test(formData.password) },
    { id: 'special', label: 'Un caractère spécial', met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne gauche - Présentation */}
          <div className="hidden lg:flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-full border border-blue-700/50 mb-6">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-blue-300">Sécurité renforcée</span>
                </div>
                
                <h1 className="text-4xl font-bold mb-4">
                  Rejoignez <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    SecuritySense
                  </span>
                </h1>
                
                <p className="text-gray-400 mb-8">
                  Développez vos compétences en cybersécurité et protégez votre entreprise contre les attaques d'ingénierie sociale.
                </p>
              </div>

              {/* Avantages */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Scénarios réalistes</div>
                    <p className="text-sm text-gray-400">
                      Entraînez-vous avec des simulations basées sur des attaques réelles
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Progression personnalisée</div>
                    <p className="text-sm text-gray-400">
                      Suivez votre évolution et recevez des recommandations adaptées
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold">Certifications reconnues</div>
                    <p className="text-sm text-gray-400">
                      Obtenez des badges et certifications valorisant vos compétences
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">500+</div>
                  <div className="text-sm text-gray-400">Utilisateurs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">95%</div>
                  <div className="text-sm text-gray-400">Réussite</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Colonne droite - Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-900/30 to-blue-700/30 mb-6">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Créer un compte</h2>
              <p className="text-gray-400">Commencez votre parcours de formation</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>{success}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Force du mot de passe */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Force du mot de passe</span>
                      <span className="text-xs font-medium">{strengthLabel}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${strength}%` }}
                        className={`h-full bg-gradient-to-r ${strengthColor}`}
                      />
                    </div>

                    {/* Exigences */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {passwordRequirements.map((req) => (
                        <div key={req.id} className="flex items-center gap-2">
                          {req.met ? (
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-gray-600" />
                          )}
                          <span className={`text-xs ${req.met ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-12 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Confirmer votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="mt-2">
                    {formData.password === formData.confirmPassword ? (
                      <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Les mots de passe correspondent
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <XCircle className="w-4 h-4" />
                        Les mots de passe ne correspondent pas
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    J'accepte les{' '}
                    <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                      politique de confidentialité
                    </Link>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={formData.newsletter}
                    onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                    className="mt-1"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-400">
                    Je souhaite recevoir des conseils de sécurité et des mises à jour
                  </label>
                </div>
              </div>

              <CyberButton
                type="submit"
                variant="primary"
                loading={isLoading}
                className="w-full group"
                icon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                iconPosition="right"
              >
                {isLoading ? 'Création du compte...' : 'Créer mon compte'}
              </CyberButton>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-950 text-gray-500">
                    Ou inscrivez-vous avec
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOAuthSignUp('google')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  onClick={() => handleOAuthSignUp('github')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Déjà un compte ?{' '}
                <Link
                  href="/auth/signin"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-600">
                En créant un compte, vous acceptez nos{' '}
                <Link href="/terms" className="text-gray-500 hover:text-gray-400">
                  Conditions d'utilisation
                </Link>{' '}
                et notre{' '}
                <Link href="/privacy" className="text-gray-500 hover:text-gray-400">
                  Politique de confidentialité
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Pour mobile : afficher les avantages en dessous */}
        <div className="lg:hidden mt-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-4">Pourquoi nous rejoindre ?</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-semibold">Formation interactive</div>
              </div>
              <p className="text-sm text-gray-400">
                Scénarios réalistes basés sur des attaques du monde réel
              </p>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <div className="font-semibold">Progression</div>
              </div>
              <p className="text-sm text-gray-400">
                Suivez votre évolution et débloquez des niveaux
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}