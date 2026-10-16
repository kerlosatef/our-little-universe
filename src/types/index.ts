export type Lang = 'en' | 'ar';

export type PageId =
  | 'home'
  | 'write'
  | 'studio'
  | 'themes'
  | 'messages'
  | 'calendar'
  | 'memories'
  | 'favorites'
  | 'settings'
  | 'blueprint';

export interface Design {
  layout: string;
  bgColor: string;
  bgGradient: string;
  useGradient: boolean;
  bgTexture: string; // 'none' | 'dots' | 'lines' | 'paper' | 'stars'
  textColor: string;
  fontFamily: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  borderStyle: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  shadowIntensity: 'none' | 'soft' | 'deep' | 'glow';
  sticker: string;
  particleEffect?: 'none' | 'hearts' | 'sparkles' | 'sakura' | 'stars';
  entranceEffect?: string;
  cardWidth?: 'compact' | 'medium' | 'wide';
  padding?: number;
  headerText?: string;
  footerText?: string;
  dateFormat?: 'full' | 'short' | 'poetic';
  cardDark?: boolean;
}

export interface Member {
  username: string;
  passwordHash: string;
  displayName: string;
  nickname: string;
  avatarEmoji: string;
  avatarUrl?: string;
  bubbleColor: string;
  reminderTime: string;
  remindersEnabled: boolean;
  joinedAt: string;
}

export interface CustomTheme {
  accent: string;
  textPrimary: string;
  border: string;
}

export interface CoupleSpace {
  id: string;
  pairingCode: string;
  coupleName: string;
  websiteTitle: string;
  activeThemeId: string;
  customTheme?: CustomTheme;
  createdAt: string;
  members: {
    partnerA: Member | null;
    partnerB: Member | null;
  };
}

export interface Reply {
  authorRole: 'partnerA' | 'partnerB';
  authorName: string;
  text: string;
  createdAt: string;
}

export interface Message {
  id: string;
  coupleId: string;
  senderRole: 'partnerA' | 'partnerB';
  senderName: string;
  title: string;
  body: string;
  mood: string;
  photoData?: string;
  voiceData?: string;
  scheduledDate: string;
  isDraft: boolean;
  isFavorite: boolean;
  isRead: boolean;
  design: Design;
  reactions: string[];
  replies: Reply[];
  createdAt: string;
  updatedAt?: string;
}

export interface Template {
  id: string;
  coupleId: string;
  name: string;
  design: Design;
  createdAt: string;
}

export interface Memory {
  id: string;
  coupleId: string;
  title: string;
  caption: string;
  category: string;
  date: string;
  photoData?: string;
  createdBy: string;
  createdAt: string;
}

export interface Theme {
  id: string;
  name: string;
  nameAr: string;
  emoji: string;
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentSoft: string;
  border: string;
  dark: boolean;
}

export interface LayoutItem {
  id: string;
  name: string;
  icon: string;
  desc: string;
}
