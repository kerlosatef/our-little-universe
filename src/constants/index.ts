import { Theme, LayoutItem, Design } from '../types';

export const TRANSLATIONS = {
  en: {
    appName: "Happy Messages",
    tagline: "Our Private Digital Universe",
    welcomeGreeting: "Hey",
    welcomeSub: "Welcome to our little world.",
    todaysMessages: "Today's Happy Messages",
    emptyToday: "Someone could make today a little sweeter. 💌",
    writeMessage: "Write a Message",
    timeline: "Our Message Timeline",
    littleCalendar: "Our Little Calendar",
    ourFavorites: "Our Favorites",
    ourMemories: "Our Little Memories",
    navHome: "Home",
    navWrite: "Write",
    navStudio: "Design Studio",
    navThemes: "Themes",
    navMessages: "Archive",
    navCalendar: "Calendar",
    navMemories: "Memories",
    navFavorites: "Favorites",
    navSettings: "Settings & Supabase",
    navBlueprint: "DB & Security Spec",
    loginTitle: "Enter Our Private Sanctuary",
    createSpace: "Create New Couple Space",
    joinSpace: "Join Partner with Pairing Code",
    loginExisting: "Sign In to Existing Space",
    username: "Username",
    password: "Secret Password",
    displayName: "Your Display Name",
    nickname: "Your Cute Nickname (e.g., My Love)",
    pairingCode: "6-Character Pairing Code",
    coupleTitle: "Couple Space Name (e.g., Alex & Maya)",
    websiteTitle: "Custom Website Title",
    msgTitle: "Message Title",
    msgBody: "Write something from the heart...",
    mood: "Mood / Vibe",
    attachPhoto: "Attach Photo",
    recordVoice: "Record Voice Note",
    stopRecording: "Stop Recording",
    saveDraft: "Save as Draft",
    sendMessage: "Send with Love 💌",
    designStudio: "Message Design Studio",
    resetDesign: "Reset Design",
    saveTemplate: "Save as My Template",
    openEnvelope: "Tap to Open Your Letter",
    closeLetter: "Close Letter",
    replayAnimation: "Replay Opening",
    privateReply: "Write a private reply...",
    unread: "Unread",
    read: "Read",
    favorite: "Favorite",
    exportPrint: "Print / Save as Keepsake PDF",
    searchPlaceholder: "Search titles, words, memories...",
    allSenders: "All Senders",
    allMoods: "All Moods",
    allStatuses: "All Statuses",
    memoriesVault: "Our Private Memories Vault",
    addMemory: "Add New Memory",
    settingsTitle: "Sanctuary Settings & Personalization",
    logout: "Lock Sanctuary (Logout)",
    reducedMotion: "Reduced Motion (Accessibility)",
    partnerWaiting: "Waiting for your partner to join with code:"
  },
  ar: {
    appName: "رسائل سعيدة",
    tagline: "عالمنا الرقمي الخاص",
    welcomeGreeting: "أهلاً",
    welcomeSub: "مرحباً بك في عالمنا الصغير.",
    todaysMessages: "رسائل اليوم السعيدة",
    emptyToday: "يمكن لأحدنا أن يجعل اليوم أكثر حلاوة. 💌",
    writeMessage: "اكتب رسالة",
    timeline: "شريط رسائلنا",
    littleCalendar: "تقويمنا الصغير",
    ourFavorites: "مفضلاتنا",
    ourMemories: "ذكرياتنا الجميلة",
    navHome: "الرئيسية",
    navWrite: "كتابة رسالة",
    navStudio: "استوديو التصميم",
    navThemes: "السمات والألوان",
    navMessages: "الأرشيف",
    navCalendar: "التقويم",
    navMemories: "الذكريات",
    navFavorites: "المفضلة",
    navSettings: "الإعدادات وسوبابيز",
    navBlueprint: "قاعدة البيانات والأمان",
    loginTitle: "الدخول إلى ملاذنا الخاص",
    createSpace: "إنشاء مساحة جديدة للشريكين",
    joinSpace: "الانضمام للشريك برمز الاقتران",
    loginExisting: "تسجيل الدخول لمساحة حالية",
    username: "اسم المستخدم",
    password: "كلمة المرور السرية",
    displayName: "اسم العرض الخاص بك",
    nickname: "اللقب اللطيف (مثل: حبيبي، روحي)",
    pairingCode: "رمز الاقتران (6 أحرف)",
    coupleTitle: "اسم المساحة (مثل: أحمد وسارة)",
    websiteTitle: "عنوان الموقع المخصص",
    msgTitle: "عنوان الرسالة",
    msgBody: "اكتب شيئاً ينبع من القلب...",
    mood: "المزاج / الشعور",
    attachPhoto: "إرفاق صورة",
    recordVoice: "تسجيل ملاحظة صوتية",
    stopRecording: "إيقاف التسجيل",
    saveDraft: "حفظ كمسودة",
    sendMessage: "إرسال بكل حب 💌",
    designStudio: "استوديو تصميم الرسائل",
    resetDesign: "إعادة ضبط التصميم",
    saveTemplate: "حفظ كقالب خاص بي",
    openEnvelope: "اضغط لفتح رسالتك",
    closeLetter: "إغلاق الرسالة",
    replayAnimation: "إعادة حركة الفتح",
    privateReply: "اكتب رداً خاصاً...",
    unread: "غير مقروءة",
    read: "مقروءة",
    favorite: "مفضلة",
    exportPrint: "طباعة / حفظ كملف تذكاري PDF",
    searchPlaceholder: "ابحث في العناوين، الكلمات، الذكريات...",
    allSenders: "كل المرسلين",
    allMoods: "كل المشاعر",
    allStatuses: "كل الحالات",
    memoriesVault: "خزنة ذكرياتنا الخاصة",
    addMemory: "إضافة ذكرى جديدة",
    settingsTitle: "إعدادات الملاذ والتخصيص",
    logout: "قفل الملاذ (خروج)",
    reducedMotion: "تقليل الحركة (إمكانية الوصول)",
    partnerWaiting: "بانتظار انضمام شريكك باستخدام الرمز:"
  }
};

export const WEBSITE_THEMES: Theme[] = [
  {
    id: 'pink-romance',
    name: 'Pink Romance',
    nameAr: 'رومانسية وردية',
    emoji: '🌹',
    bgGradient: 'linear-gradient(135deg, #fff5f7 0%, #fce4ec 50%, #f8bbd0 100%)',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    textPrimary: '#4a1525',
    textSecondary: '#883955',
    accent: '#e91e63',
    accentSoft: '#fce4ec',
    border: '#f48fb1',
    dark: false
  },
  {
    id: 'midnight-love',
    name: 'Midnight Love',
    nameAr: 'حب منتصف الليل',
    emoji: '🌙',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #31102f 100%)',
    cardBg: 'rgba(30, 27, 75, 0.82)',
    textPrimary: '#fdf2f8',
    textSecondary: '#fbcfe8',
    accent: '#f472b6',
    accentSoft: 'rgba(244, 114, 182, 0.15)',
    border: '#831843',
    dark: true
  },
  {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    nameAr: 'أحلام اللافندر',
    emoji: '💜',
    bgGradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    textPrimary: '#2e1065',
    textSecondary: '#6b21a8',
    accent: '#8b5cf6',
    accentSoft: '#ede9fe',
    border: '#c4b5fd',
    dark: false
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    nameAr: 'زهر الكرز',
    emoji: '🌸',
    bgGradient: 'linear-gradient(135deg, #fff0f3 0%, #ffe5ec 50%, #ffc2d1 100%)',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textPrimary: '#590d22',
    textSecondary: '#800f2f',
    accent: '#ff4d6d',
    accentSoft: '#ffe5ec',
    border: '#ffb3c1',
    dark: false
  },
  {
    id: 'soft-pastel',
    name: 'Soft Pastel',
    nameAr: 'باستيل ناعم',
    emoji: '🧁',
    bgGradient: 'linear-gradient(135deg, #fdfbfb 0%, #fcf1f7 45%, #e8f4f8 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    textPrimary: '#334155',
    textSecondary: '#64748b',
    accent: '#ec4899',
    accentSoft: '#fce7f3',
    border: '#f9a8d4',
    dark: false
  },
  {
    id: 'black-gold',
    name: 'Black and Gold',
    nameAr: 'الأسود والذهبي الملكي',
    emoji: '👑',
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27201c 100%)',
    cardBg: 'rgba(24, 24, 27, 0.9)',
    textPrimary: '#fef3c7',
    textSecondary: '#fde68a',
    accent: '#f59e0b',
    accentSoft: 'rgba(245, 158, 11, 0.15)',
    border: '#78350f',
    dark: true
  },
  {
    id: 'cozy-winter',
    name: 'Cozy Winter',
    nameAr: 'شتاء دافئ',
    emoji: '☕',
    bgGradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    accent: '#0284c7',
    accentSoft: '#e0f2fe',
    border: '#94a3b8',
    dark: false
  },
  {
    id: 'starry-night',
    name: 'Starry Night',
    nameAr: 'ليلة مرصعة بالنجوم',
    emoji: '✨',
    bgGradient: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)',
    cardBg: 'rgba(15, 23, 42, 0.85)',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    accent: '#38bdf8',
    accentSoft: 'rgba(56, 189, 248, 0.15)',
    border: '#334155',
    dark: true
  },
  {
    id: 'vintage-letters',
    name: 'Vintage Love Letters',
    nameAr: 'رسائل حب كلاسيكية',
    emoji: '📜',
    bgGradient: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%)',
    cardBg: 'rgba(255, 251, 235, 0.94)',
    textPrimary: '#451a03',
    textSecondary: '#78350f',
    accent: '#b45309',
    accentSoft: '#fef3c7',
    border: '#d97706',
    dark: false
  },
  {
    id: 'cute-kawaii',
    name: 'Cute Kawaii',
    nameAr: 'لطيف ومبهج',
    emoji: '🍓',
    bgGradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#881337',
    textSecondary: '#be123c',
    accent: '#f43f5e',
    accentSoft: '#ffe4e6',
    border: '#fda4af',
    dark: false
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    nameAr: 'أبيض أنيق وبسيط',
    emoji: '🕊️',
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #f3f4f6 100%)',
    cardBg: '#ffffff',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    accent: '#111827',
    accentSoft: '#f3f4f6',
    border: '#e5e7eb',
    dark: false
  },
  {
    id: 'sunset-romance',
    name: 'Sunset Romance',
    nameAr: 'غروب رومانسي',
    emoji: '🌅',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 45%, #fecdd3 100%)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    textPrimary: '#7c2d12',
    textSecondary: '#9a3412',
    accent: '#ea580c',
    accentSoft: '#ffedd5',
    border: '#fdba74',
    dark: false
  },
  {
    id: 'our-anniversary',
    name: 'Our Anniversary',
    nameAr: 'ذكرى حبنا',
    emoji: '🥂',
    bgGradient: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f5d0fe 100%)',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textPrimary: '#4a044e',
    textSecondary: '#701a75',
    accent: '#c026d3',
    accentSoft: '#fae8ff',
    border: '#e879f9',
    dark: false
  },
  {
    id: 'custom-theme',
    name: 'Custom Couple Theme',
    nameAr: 'سمتنا الخاصة المخصصة',
    emoji: '🎨',
    bgGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #ede9fe 100%)',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    textPrimary: '#500724',
    textSecondary: '#831843',
    accent: '#db2777',
    accentSoft: '#fce7f3',
    border: '#f472b6',
    dark: false
  }
];

export const MESSAGE_LAYOUTS: LayoutItem[] = [
  { id: 'romantic-letter', name: '1. Romantic Letter', icon: '💌', desc: 'Classic wax-sealed stationery with serif elegance' },
  { id: 'folded-envelope', name: '2. Folded Envelope', icon: '✉️', desc: 'Interactive envelope that unfolds when clicked' },
  { id: 'sticky-note', name: '3. Cute Sticky Note', icon: '📝', desc: 'Playful pinned note with tape and warm paper' },
  { id: 'love-postcard', name: '4. Love Postcard', icon: '📮', desc: 'Air-mail striped border with custom postage stamp' },
  { id: 'diary-page', name: '5. Diary Page', icon: '📖', desc: 'Lined notebook journal page with margin line' },
  { id: 'floating-heart', name: '6. Floating Heart Card', icon: '💖', desc: 'Soft glowing aura with rising heart particles' },
  { id: 'polaroid-card', name: '7. Polaroid Photo Card', icon: '📸', desc: 'Instant-camera frame with handwritten bottom caption' },
  { id: 'chat-bubble', name: '8. Sweet Chat Bubble', icon: '💬', desc: 'Intimate modern messenger bubble with timestamp' },
  { id: 'vintage-paper', name: '9. Vintage Paper Letter', icon: '📜', desc: 'Aged parchment texture with antique ink borders' },
  { id: 'glassmorphism', name: '10. Glassmorphism Card', icon: '✨', desc: 'Frosted translucent crystal card with neon glow' },
  { id: 'minimal-elegant', name: '11. Minimal Elegant', icon: '🕊️', desc: 'Pure editorial luxury with crisp fine-line framing' },
  { id: 'animated-gift', name: '12. Animated Gift Box', icon: '🎁', desc: 'Tied ribbon surprise box that unwraps on tap' }
];

export const DEFAULT_DESIGN: Design = {
  layout: 'romantic-letter',
  bgColor: '#fff9fb',
  bgGradient: 'linear-gradient(135deg, #fff9fb 0%, #ffeef4 100%)',
  useGradient: true,
  bgTexture: 'none',
  textColor: '#4a1525',
  fontFamily: 'Playfair Display, Georgia, serif',
  fontSize: 18,
  textAlign: 'left',
  lineHeight: 1.7,
  borderStyle: 'solid',
  borderWidth: 2,
  borderColor: '#f48fb1',
  borderRadius: 20,
  shadowIntensity: 'soft',
  sticker: '💌',
  particleEffect: 'hearts',
  entranceEffect: 'fade-up',
  cardWidth: 'medium',
  padding: 28,
  headerText: 'My Dearest,',
  footerText: 'Forever Yours ❤️',
  dateFormat: 'full',
  cardDark: false
};

export const ILLUSTRATED_AVATARS = [
  '👩‍❤️‍👨', '🦊', '🐰', '🐱', '🐼', '🐨', '🦋', '🌸', '🌙', '☀️', '🍓', '🧸', '👑', '🦢', '🌹', '✨'
];

export const MOOD_LIST = [
  { id: 'romantic', label: 'Deeply in Love', emoji: '❤️' },
  { id: 'grateful', label: 'Grateful for You', emoji: '🥹' },
  { id: 'missing', label: 'Missing You', emoji: '🌙' },
  { id: 'cheerful', label: 'Happy & Playful', emoji: '☀️' },
  { id: 'proud', label: 'So Proud of You', emoji: '🌟' },
  { id: 'cozy', label: 'Warm & Cozy', emoji: '☕' },
  { id: 'apology', label: 'Sweet Peace Offering', emoji: '🕊️' },
  { id: 'celebration', label: 'Celebrating Us', emoji: '🥂' }
];

export async function hashSecret(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text + '_happy_messages_salt_v1');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generatePairingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function formatCustomDate(isoString: string, formatType: 'full' | 'short' | 'poetic' = 'full', lang: string = 'en'): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
  if (formatType === 'short') {
    return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (formatType === 'poetic') {
    const time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    const day = d.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });
    return `${day} • ${time}`;
  }
  return d.toLocaleDateString(locale, {
    weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function compressImageFile(file: File, maxWidth = 650): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
