// app/profile/ProfileClientPage.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Award,
  Edit2,
  Save,
  Camera,
  Bell,
  Globe,
  Lock,
  CreditCard,
  Download,
  Upload,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { AlertBadge } from '@/components/ui/AlertBadge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useProgress } from '@/lib/contexts/ProgressContext';

export default function ProfileClientPage() {
  const { data: session, update } = useSession();
  const { userProgress } = useProgress();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    bio: 'Expert en sécurité informatique passionné par la formation.',
    location: 'Paris, France',
    language: 'Français',
    timezone: 'Europe/Paris',
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newsletter: true,
    securityAlerts: true,
    darkMode: true,
  });

  const stats = {
    level: userProgress?.level || 1,
    vigilanceScore: userProgress?.vigilanceScore || 50,
    completedScenarios: userProgress?.completedScenarios?.length || 0,
    badges: userProgress?.badges?.length || 0,
    memberSince: 'Janvier 2024',
    lastActive: 'Aujourd\'hui',
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simuler une mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour la session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
        }
      });
      
      setIsEditing(false);
      // showNotification('Profil mis à jour avec succès', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      // showNotification('Erreur lors de la mise à jour', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const data = {
      profile: formData,
      progress: userProgress,
      preferences,
      exportedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `securitysense-profile-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Mon Profil</h1>
          <p className="text-gray-400">
            Gérez vos informations personnelles et préférences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Profil & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Carte profil */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                   
                      <User className="w-12 h-12 text-white" />
                  
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full border border-gray-700 hover:bg-gray-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-xl font-bold w-full"
                        placeholder="Votre nom"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold">{formData.name}</h2>
                    )}
                    <button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {isEditing ? (
                        <Save className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Edit2 className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{formData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Membre depuis {stats.memberSince}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Shield className="w-4 h-4" />
                      <span>{session?.user?.role || 'Utilisateur'}</span>
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full h-24"
                      placeholder="Votre bio"
                    />
                  ) : (
                    <p className="text-gray-400">{formData.bio}</p>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Localisation</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Langue</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full"
                    >
                      <option>Français</option>
                      <option>English</option>
                      <option>Español</option>
                      <option>Deutsch</option>
                    </select>
                  </div>
                </div>
              )}
              
              {isEditing ? (
                <div className="flex gap-4">
                  <CyberButton
                    variant="primary"
                    onClick={handleSave}
                    loading={loading}
                  >
                    Sauvegarder
                  </CyberButton>
                  <CyberButton
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: session?.user?.name || '',
                        email: session?.user?.email || '',
                        bio: 'Expert en sécurité informatique passionné par la formation.',
                        location: 'Paris, France',
                        language: 'Français',
                        timezone: 'Europe/Paris',
                      });
                    }}
                  >
                    Annuler
                  </CyberButton>
                </div>
              ) : (
                <CyberButton
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  icon={<Edit2 className="w-5 h-5" />}
                >
                  Modifier le profil
                </CyberButton>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-yellow-400" />
                Statistiques
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {stats.level}
                  </div>
                  <div className="text-sm text-gray-400">Niveau</div>
                </div>
                
                <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    {stats.vigilanceScore}
                  </div>
                  <div className="text-sm text-gray-400">Vigilance</div>
                </div>
                
                <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {stats.completedScenarios}
                  </div>
                  <div className="text-sm text-gray-400">Scénarios</div>
                </div>
                
                <div className="text-center p-4 bg-gray-900/50 rounded-xl">
                  <div className="text-3xl font-bold text-amber-400 mb-2">
                    {stats.badges}
                  </div>
                  <div className="text-sm text-gray-400">Badges</div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Progression globale</h4>
                  <span className="text-emerald-400">{stats.vigilanceScore}%</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                    style={{ width: `${stats.vigilanceScore}%` }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Informations de compte */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-400" />
                Sécurité du compte
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-semibold">Adresse email</div>
                      <div className="text-sm text-gray-400">{formData.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Vérifiée</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-semibold">Mot de passe</div>
                      <div className="text-sm text-gray-400">••••••••</div>
                    </div>
                  </div>
                  <CyberButton variant="outline" size="sm">
                    Modifier
                  </CyberButton>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-semibold">Authentification à deux facteurs</div>
                      <div className="text-sm text-gray-400">Non activée</div>
                    </div>
                  </div>
                  <CyberButton variant="outline" size="sm">
                    Activer
                  </CyberButton>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-800">
                <div className="flex flex-col sm:flex-row gap-4">
                  <CyberButton
                    variant="outline"
                    onClick={handleExportData}
                    icon={<Download className="w-5 h-5" />}
                  >
                    Exporter mes données
                  </CyberButton>
                  <CyberButton
                    variant="danger"
                    icon={<Trash2 className="w-5 h-5" />}
                  >
                    Supprimer mon compte
                  </CyberButton>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Colonne de droite - Préférences & Badges */}
          <div className="space-y-8">
            {/* Préférences */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Bell className="w-6 h-6 text-purple-400" />
                Préférences
              </h3>
              
              <div className="space-y-4">
                {Object.entries(preferences).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        value ? 'bg-emerald-400/10' : 'bg-gray-800/50'
                      }`}>
                        <Bell className={`w-4 h-4 ${value ? 'text-emerald-400' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <div className="font-medium">
                          {key === 'emailNotifications' && 'Notifications email'}
                          {key === 'pushNotifications' && 'Notifications push'}
                          {key === 'newsletter' && 'Newsletter'}
                          {key === 'securityAlerts' && 'Alertes sécurité'}
                          {key === 'darkMode' && 'Mode sombre'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setPreferences({
                        ...preferences,
                        [key]: !value
                      })}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-emerald-500' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                        value ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-800">
                <CyberButton variant="outline" className="w-full">
                  Sauvegarder les préférences
                </CyberButton>
              </div>
            </motion.div>

            {/* Badges récents */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-400" />
                Badges récents
              </h3>
              
              <div className="space-y-4">
                {userProgress?.badges?.slice(0, 5).map((badge, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="font-semibold capitalize">{badge.replace('-', ' ')}</div>
                      <div className="text-xs text-gray-400">
                        {badge === 'starter' && 'Première connexion'}
                        {badge === 'learner' && '3 scénarios complétés'}
                        {badge === 'vigilant' && 'Score > 80%'}
                        {badge === 'consistent' && '3 jours d\'activité'}
                        {badge.includes('master') && 'Expert'}
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!userProgress?.badges || userProgress.badges.length === 0) && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400">Aucun badge obtenu</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Complétez des scénarios pour gagner des badges
                    </p>
                  </div>
                )}
              </div>
              
              {userProgress?.badges && userProgress.badges.length > 0 && (
                <div className="mt-6">
                  <CyberButton
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = '/progress'}
                  >
                    Voir tous les badges
                  </CyberButton>
                </div>
              )}
            </motion.div>

            {/* Score de vigilance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-900/20 to-emerald-900/20 rounded-2xl border border-blue-800/30 p-8"
            >
              <div className="text-center">
                <ProgressRing
                  progress={stats.vigilanceScore}
                  size={120}
                  label="Vigilance"
                />
                <h4 className="font-bold text-xl mt-4 mb-2">
                  Score de vigilance
                </h4>
                <p className="text-gray-400 text-sm mb-6">
                  Votre niveau actuel de protection contre les attaques
                </p>
                <CyberButton
                  variant="primary"
                  onClick={() => window.location.href = '/progress'}
                  className="w-full"
                >
                  Améliorer mon score
                </CyberButton>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}