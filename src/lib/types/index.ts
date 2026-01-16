// Types pour les scénarios
export interface Scenario {
  id: string;
  title: string;
  description: string;
  type: 'phishing' | 'vishing' | 'pretexting' | 'tailgating' | 'qr';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  completionRate?: number;
  data: ScenarioData;
  biases: string[];
  tips: string[];
}

export type ScenarioData = 
  | PhishingData 
  | VishingData 
  | TailgatingData 
  | PretextingData 
  | QRData;

export interface PhishingData {
  email: {
    from: {
      name: string;
      email: string;
      avatar?: string;
    };
    to: string;
    subject: string;
    body: string;
    attachments?: Array<{
      name: string;
      size: string;
      type: string;
      malicious: boolean;
    }>;
    links?: Array<{
      text: string;
      url: string;
      malicious: boolean;
    }>;
    urgencyLevel: 'low' | 'medium' | 'high';
  };
  redFlags: Array<{
    type: 'sender' | 'subject' | 'body' | 'attachment' | 'link' | 'urgency';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  correctAction: 'report' | 'delete' | 'ignore' | 'verify';
}

export interface VishingData {
  call: {
    caller: {
      name: string;
      company?: string;
      number: string;
      spoofed: boolean;
    };
    pretext: string;
    request: string;
    pressureTactics: string[];
    tone: 'friendly' | 'urgent' | 'authoritative' | 'helpful';
    backgroundNoise?: boolean;
  };
  redFlags: Array<{
    type: 'caller' | 'request' | 'pressure' | 'tone' | 'credentials';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  correctAction: 'verify' | 'decline' | 'transfer' | 'report';
}

export interface TailgatingData {
  situation: {
    location: string;
    time: string;
    person: {
      appearance: string;
      behavior: string;
      story: string;
      items: string[];
      suspicious: boolean;
    };
    context: string;
  };
  redFlags: Array<{
    type: 'appearance' | 'behavior' | 'story' | 'items' | 'timing';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  correctAction: 'allow' | 'deny' | 'escort' | 'verify';
}

export interface PretextingData {
  interaction: {
    platform: 'linkedin' | 'email' | 'phone' | 'in-person';
    persona: {
      role: string;
      company?: string;
      story: string;
    };
    request: string;
    informationSought: string[];
  };
  redFlags: string[];
  correctAction: 'verify' | 'decline' | 'report' | 'redirect';
}

export interface QRData {
  context: {
    location: string;
    appearance: string;
    message: string;
  };
  scanResult?: {
    url: string;
    permissions: string[];
    legitimacy: boolean;
  };
  redFlags: string[];
  correctAction: 'scan' | 'ignore' | 'report' | 'verify';
}

// Types pour les jeux
export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  duration: number;
  questions: number;
  avgScore: number;
  completionRate: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: boolean;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tip?: string;
}

export interface GameScenario {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  correctSigns: string[];
  allSigns: Array<{
    id: string;
    text: string;
    description: string;
  }>;
}

// Types pour l'utilisateur et la progression
export interface UserProgress {
  level: number;
  xp: number;
  vigilanceScore: number;
  completedScenarios: string[];
  badges: string[];
  gamesPlayed: number;
  consecutiveCorrect: number;
  lastPlayed: Date | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirements: string[];
}

// Types pour les notifications
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  read?: boolean;
}

// Types pour les composants UI
export interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  glow?: boolean;
}

export interface AlertBadgeProps {
  type: 'success' | 'warning' | 'error' | 'info' | 'security';
  message: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
}

export interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercentage?: boolean;
  gradient?: boolean;
}

export interface ScenarioCardProps {
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

export interface ScoreIndicatorProps {
  score: number;
  previousScore?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Types pour les contextes
export interface ProgressContextType {
  userProgress: UserProgress;
  completeScenario: (scenarioId: string, score: number) => void;
  completeGame: (score: number) => void;
  addBadge: (badgeId: string) => void;
  resetProgress: () => void;
}

export interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType, title?: string, duration?: number) => void;
  clearNotifications: () => void;
}


// Types pour les conséquences
export interface Consequence {
  title: string;
  description: string;
  impact: string;
  icon: React.ReactNode;
}

export interface ScenarioConsequences {
  [key: string]: Consequence;
}

export interface AllConsequences {
  phishing: {
    [key: string]: Consequence;
  };
  vishing: {
    [key: string]: Consequence;
  };
  tailgating: {
    [key: string]: Consequence;
  };
  pretexting: {
    [key: string]: Consequence;
  };
  qr: {
    [key: string]: Consequence;
  };
}

// Type pour les actions possibles
export type PhishingAction = 'report' | 'delete' | 'ignore' | 'verify';
export type VishingAction = 'verify' | 'decline' | 'transfer' | 'report';
export type TailgatingAction = 'allow' | 'deny' | 'escort' | 'verify';
export type PretextingAction = 'verify' | 'decline' | 'report' | 'redirect';
export type QRAction = 'scan' | 'ignore' | 'report' | 'verify';

export type ScenarioAction = 
  | PhishingAction 
  | VishingAction 
  | TailgatingAction 
  | PretextingAction 
  | QRAction;


  // ... autres types ...

// Types pour la navigation
export interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: NotificationType;
}

// ... reste du fichier ...


export interface EmailLink {
  text: string;
  url: string;
  malicious: boolean;
}

export interface EmailAttachments {
      name: string;
      size: string;
      type: string;
      malicious: boolean;
}
  