export interface PetProfile {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  personality: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  metadata?: {
    petName?: string;
    tone?: string;
    platform?: string;
    estimatedDuration?: string;
  };
}

export interface ScriptHistory {
  id: string;
  title: string;
  petName?: string;
  content: string;
  tone: string;
  platform: string;
  date: string;
  favorite?: boolean;
}

export type ActiveTab = 'chat' | 'history' | 'trends' | 'pets' | 'settings';
