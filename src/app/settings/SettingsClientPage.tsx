// app/settings/SettingsClientPage.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Bell,
  Eye,
  Globe,
  Shield,
  Palette,
  Database,
  Download,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle,
  Moon,
  Sun,
  Volume2,
  Keyboard,
  Users,
  Clock,
  Mail,
  Lock
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { AlertBadge } from '@/components/ui/AlertBadge';
import React from 'react';

export default function SettingsClientPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Général
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    
    // Apparence
    theme: 'dark',
    fontSize: 'medium',
    reduceAnimations: false,
    highContrast: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    securityAlerts: true,
    progressUpdates: true,
    soundEffects: true,
    vibration: false,
    
    // Confidentialité
    dataCollection: true,
    analytics: true,
    showOnlineStatus: true,
    allowFriendRequests: true,
    
    // Sécurité
    twoFactorAuth: false,
    loginAlerts: true,
    autoLogout: 30, // minutes
    sessionManagement: true,
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: SettingsIcon },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Eye },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'data', label: 'Données', icon: Database },
  ];

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simuler sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sauvegarder dans localStorage
      localStorage.setItem('securitysense-settings', JSON.stringify(settings));
      
      // showNotification('Paramètres sauvegardés', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      // showNotification('Erreur de sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExportSettings = () => {
    const data = {
      settings,
      exportedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `securitysense-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetSettings = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setSettings({
        language: 'fr',
        timezone: 'Europe/Paris',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        theme: 'dark',
        fontSize: 'medium',
        reduceAnimations: false,
        highContrast: false,
        emailNotifications: true,
        pushNotifications: true,
        securityAlerts: true,
        progressUpdates: true,
        soundEffects: true,
        vibration: false,
        dataCollection: true,
        analytics: true,
        showOnlineStatus: true,
        allowFriendRequests: true,
        twoFactorAuth: false,
        loginAlerts: true,
        autoLogout: 30,
        sessionManagement: true,
      });
      localStorage.removeItem('securitysense-settings');
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Langue</label>
          <select
            value={settings.language}
            onChange={(e) => setSettings({...settings, language: e.target.value})}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Fuseau horaire</label>
          <select
            value={settings.timezone}
            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5"
          >
            <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
            <option value="Europe/London">Europe/London (GMT+0)</option>
            <option value="America/New_York">America/New_York (GMT-5)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Format date</label>
          <select
            value={settings.dateFormat}
            onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Format heure</label>
          <select
            value={settings.timeFormat}
            onChange={(e) => setSettings({...settings, timeFormat: e.target.value})}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5"
          >
            <option value="24h">24 heures</option>
            <option value="12h">12 heures</option>
          </select>
        </div>
      </div>
      
      <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-800/30">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Préférences régionales</h4>
            <p className="text-sm text-gray-400">
              Ces paramètres affectent l'affichage des dates, heures et formats numériques
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Thème</label>
          <div className="flex gap-4">
            <button
              onClick={() => setSettings({...settings, theme: 'dark'})}
              className={`flex-1 p-4 rounded-xl border ${
                settings.theme === 'dark' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <Moon className="w-6 h-6 mx-auto mb-2" />
              <div className="text-center">Sombre</div>
            </button>
            <button
              onClick={() => setSettings({...settings, theme: 'light'})}
              className={`flex-1 p-4 rounded-xl border ${
                settings.theme === 'light' 
                  ? 'border-amber-500 bg-amber-500/10' 
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <Sun className="w-6 h-6 mx-auto mb-2" />
              <div className="text-center">Clair</div>
            </button>
            <button
              onClick={() => setSettings({...settings, theme: 'system'})}
              className={`flex-1 p-4 rounded-xl border ${
                settings.theme === 'system' 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <SettingsIcon className="w-6 h-6 mx-auto mb-2" />
              <div className="text-center">Système</div>
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Taille police</label>
          <select
            value={settings.fontSize}
            onChange={(e) => setSettings({...settings, fontSize: e.target.value})}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5"
          >
            <option value="small">Petite</option>
            <option value="medium">Moyenne</option>
            <option value="large">Grande</option>
            <option value="xlarge">Très grande</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="font-semibold">Contraste élevé</div>
              <div className="text-sm text-gray-400">Améliore la lisibilité</div>
            </div>
          </div>
          <button
            onClick={() => setSettings({...settings, highContrast: !settings.highContrast})}
            className={`w-12 h-6 rounded-full transition-colors ${
              settings.highContrast ? 'bg-emerald-500' : 'bg-gray-700'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
              settings.highContrast ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="font-semibold">Réduire les animations</div>
              <div className="text-sm text-gray-400">Désactive les animations inutiles</div>
            </div>
          </div>
          <button
            onClick={() => setSettings({...settings, reduceAnimations: !settings.reduceAnimations})}
            className={`w-12 h-6 rounded-full transition-colors ${
              settings.reduceAnimations ? 'bg-emerald-500' : 'bg-gray-700'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
              settings.reduceAnimations ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Notifications email', icon: Mail },
          { key: 'pushNotifications', label: 'Notifications push', icon: Bell },
          { key: 'securityAlerts', label: 'Alertes de sécurité', icon: Shield },
          { key: 'progressUpdates', label: 'Mises à jour de progression', icon: Clock },
          { key: 'soundEffects', label: 'Effets sonores', icon: Volume2 },
          { key: 'vibration', label: 'Vibration', icon: Keyboard },
        ].map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-semibold">{label}</div>
                <div className="text-sm text-gray-400">
                  {key === 'emailNotifications' && 'Recevoir des emails de notification'}
                  {key === 'pushNotifications' && 'Notifications dans le navigateur'}
                  {key === 'securityAlerts' && 'Alertes importantes de sécurité'}
                  {key === 'progressUpdates' && 'Mises à jour de votre progression'}
                  {key === 'soundEffects' && 'Sons pendant les exercices'}
                  {key === 'vibration' && 'Vibration sur mobile'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSettings({...settings, [key]: !settings[key as keyof typeof settings]})}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings[key as keyof typeof settings] ? 'bg-emerald-500' : 'bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                settings[key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <AlertBadge
        type="security"
        message="Vos données sont cryptées et protégées"
        className="w-full"
      />
      
      <div className="space-y-4">
        {[
          { key: 'dataCollection', label: 'Collecte de données', description: 'Améliorer le service' },
          { key: 'analytics', label: 'Analytics', description: 'Suivi d\'utilisation anonyme' },
          { key: 'showOnlineStatus', label: 'Statut en ligne', description: 'Visible par les autres' },
          { key: 'allowFriendRequests', label: 'Demandes d\'ami', description: 'Autoriser les invitations' },
        ].map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="font-semibold">{label}</div>
                <div className="text-sm text-gray-400">{description}</div>
              </div>
            </div>
            <button
              onClick={() => setSettings({...settings, [key]: !settings[key as keyof typeof settings]})}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings[key as keyof typeof settings] ? 'bg-emerald-500' : 'bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                settings[key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-900/20 rounded-xl border border-emerald-800/30">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">Sécurité renforcée</h4>
            <p className="text-sm text-gray-400">
              Activez ces options pour protéger davantage votre compte
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="font-semibold">Authentification à deux facteurs</div>
              <div className="text-sm text-gray-400">Niveau de sécurité supplémentaire</div>
            </div>
          </div>
          <CyberButton
            variant={settings.twoFactorAuth ? 'outline' : 'primary'}
            size="sm"
            onClick={() => setSettings({...settings, twoFactorAuth: !settings.twoFactorAuth})}
          >
            {settings.twoFactorAuth ? 'Désactiver' : 'Activer'}
          </CyberButton>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="font-semibold">Alertes de connexion</div>
              <div className="text-sm text-gray-400">Notification des nouvelles connexions</div>
            </div>
          </div>
          <button
            onClick={() => setSettings({...settings, loginAlerts: !settings.loginAlerts})}
            className={`w-12 h-6 rounded-full transition-colors ${
              settings.loginAlerts ? 'bg-emerald-500' : 'bg-gray-700'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
              settings.loginAlerts ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
        </div>
        
        <div className="p-4 bg-gray-900/50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-semibold">Déconnexion automatique</div>
                <div className="text-sm text-gray-400">Après inactivité</div>
              </div>
            </div>
            <div className="text-lg font-bold">{settings.autoLogout} min</div>
          </div>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={settings.autoLogout}
            onChange={(e) => setSettings({...settings, autoLogout: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>5 min</span>
            <span>30 min</span>
            <span>60 min</span>
            <span>120 min</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <AlertBadge
        type="warning"
        message="Ces actions sont permanentes"
        className="w-full"
      />
      
      <div className="space-y-4">
        <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
          <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-400" />
            Export des données
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            Téléchargez toutes vos données personnelles au format JSON
          </p>
          <CyberButton
            variant="outline"
            onClick={handleExportSettings}
            className="w-full"
            icon={<Download className="w-5 h-5" />}
          >
            Exporter mes paramètres
          </CyberButton>
        </div>
        
        <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
          <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            Réinitialisation
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            Remet tous les paramètres à leurs valeurs par défaut
          </p>
          <CyberButton
            variant="outline"
            onClick={handleResetSettings}
            className="w-full"
            icon={<Trash2 className="w-5 h-5" />}
          >
            Réinitialiser les paramètres
          </CyberButton>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'notifications': return renderNotificationSettings();
      case 'privacy': return renderPrivacySettings();
      case 'security': return renderSecuritySettings();
      case 'data': return renderDataSettings();
      default: return renderGeneralSettings();
    }
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Paramètres</h1>
          <p className="text-gray-400">
            Personnalisez SecuritySense selon vos préférences
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation latérale */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'hover:bg-gray-800/50 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-800">
                <CyberButton
                  variant="primary"
                  onClick={handleSaveSettings}
                  loading={saving}
                  className="w-full"
                  icon={<Save className="w-5 h-5" />}
                >
                  Sauvegarder
                </CyberButton>
              </div>
            </div>
          </motion.div>

          {/* Contenu principal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                  {tabs.find(t => t.id === activeTab)?.icon && 
                    React.createElement(tabs.find(t => t.id === activeTab)!.icon, {
                      className: "w-6 h-6"
                    })
                  }
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-gray-400">
                  {activeTab === 'general' && 'Gérez les paramètres généraux de l\'application'}
                  {activeTab === 'appearance' && 'Personnalisez l\'apparence de l\'interface'}
                  {activeTab === 'notifications' && 'Contrôlez vos préférences de notification'}
                  {activeTab === 'privacy' && 'Gérez vos paramètres de confidentialité'}
                  {activeTab === 'security' && 'Renforcez la sécurité de votre compte'}
                  {activeTab === 'data' && 'Gérez vos données et préférences'}
                </p>
              </div>

              {renderTabContent()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}