'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info
} from 'lucide-react';

// Types locaux pour éviter les problèmes d'import
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  read?: boolean;
}

// Interface pour le contexte
export interface NotificationContextType {
  showNotification: (
    message: string, 
    type?: NotificationType, 
    title?: string, 
    duration?: number
  ) => void;
  clearNotifications: () => void;
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

// Création du contexte avec valeur par défaut
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Props pour le provider
interface NotificationProviderProps {
  children: ReactNode;
}

// Provider principal
export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Afficher une notification
  const showNotification = useCallback((
    message: string, 
    type: NotificationType = 'info', 
    title?: string,
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    
    // Titre par défaut basé sur le type
    const defaultTitles: Record<NotificationType, string> = {
      success: 'Succès',
      error: 'Erreur',
      warning: 'Attention',
      info: 'Information'
    };
    
    const newNotification: Notification = {
      id,
      type,
      title: title || defaultTitles[type],
      message,
      duration,
      read: false
    };

    setNotifications(prev => [...prev, newNotification]);

    // Suppression automatique après la durée
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);

  // Effacer toutes les notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Marquer une notification comme lue
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Supprimer une notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Compter les notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;

  // Obtenir l'icône selon le type
  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <AlertTriangle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
    }
  };

  // Obtenir les couleurs selon le type
  const getColorClasses = (type: NotificationType): string => {
    switch(type) {
      case 'success': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
      case 'error': return 'bg-red-400/10 text-red-400 border-red-400/20';
      case 'warning': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
      case 'info': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
    }
  };

  // Valeur du contexte
  const contextValue: NotificationContextType = {
    showNotification,
    clearNotifications,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Container pour les notifications toast */}
      <div className="fixed top-4 right-4 z-50 w-96 max-w-full space-y-3">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className={`rounded-xl border p-4 ${getColorClasses(notification.type)} backdrop-blur-sm shadow-2xl`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10">
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-semibold mb-1 truncate">{notification.title}</div>
                  <p className="text-sm opacity-90 break-words">{notification.message}</p>
                </div>
                
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Fermer la notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Barre de progression pour la durée */}
              {notification.duration && notification.duration > 0 && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: notification.duration / 1000 }}
                  className="h-1 bg-current opacity-30 mt-3 rounded-full"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  
  return context;
}