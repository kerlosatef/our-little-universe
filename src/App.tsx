import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Heart, Mail, Sparkles, Calendar as CalendarIcon,
  Image as ImageIcon, Mic, Square, Star,
  Settings, Palette, PenTool, Lock, Key,
  Search, Filter, Printer, Camera, Feather,
  CheckCircle2, AlertCircle, Database, Send,
  Copy, ChevronLeft, ChevronRight, Eye, RefreshCw
} from 'lucide-react';

import {
  CoupleSpace, Message, Template, Memory, Design, PageId, Lang, Theme, Member
} from './types';
import {
  TRANSLATIONS, WEBSITE_THEMES, MESSAGE_LAYOUTS, DEFAULT_DESIGN,
  ILLUSTRATED_AVATARS, MOOD_LIST, hashSecret, generatePairingCode,
  formatCustomDate, compressImageFile
} from './constants';
import {
  dbFetchAllSpaces, dbSaveCoupleSpace, dbFetchMessages, dbSaveMessage,
  dbDeleteMessage, dbFetchTemplates, dbSaveTemplate, dbDeleteTemplate,
  dbFetchMemories, dbSaveMemory, dbDeleteMemory, subscribeToCoupleRealtime,
  isSupabaseConnected, saveSupabaseCustomConfig, getActiveSupabaseInfo
} from './lib/supabase';

import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { StyledMessageCard } from './components/StyledMessageCard';
import { EnvelopeExperienceModal } from './components/EnvelopeExperienceModal';
import { AudioVoicePlayer } from './components/AudioVoicePlayer';

export default function App() {
  // Session & Couple State
  const [activeCoupleId, setActiveCoupleId] = useState<string>(() => {
    return localStorage.getItem('happy_couple_active_id') || '';
  });
  const [activeMemberRole, setActiveMemberRole] = useState<'partnerA' | 'partnerB' | ''>(() => {
    return (localStorage.getItem('happy_couple_active_role') as any) || '';
  });
  const [coupleSpace, setCoupleSpace] = useState<CoupleSpace | null>(null);

  // Collections
  const [allSpaces, setAllSpaces] = useState<CoupleSpace[]>([]);
  const [coupleMessages, setCoupleMessages] = useState<Message[]>([]);
  const [coupleTemplates, setCoupleTemplates] = useState<Template[]>([]);
  const [coupleMemories, setCoupleMemories] = useState<Memory[]>([]);

  // Navigation & Preferences
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('happy_couple_lang') as Lang) || 'en';
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [openedMessageId, setOpenedMessageId] = useState<string | null>(null);

  // Auth Form State
  const [authTab, setAuthTab] = useState<'login' | 'create' | 'join'>('login');
  const [authForm, setAuthForm] = useState({
    username: '',
    password: '',
    displayName: '',
    nickname: 'My Love',
    coupleName: 'Our Little World',
    websiteTitle: 'Happy Messages 💌',
    pairingCode: '',
    avatarEmoji: '👩‍❤️‍👨'
  });
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Write Form State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [msgForm, setMsgForm] = useState({
    title: '',
    body: '',
    mood: 'romantic',
    photoData: '',
    voiceData: '',
    scheduledDate: new Date().toISOString().slice(0, 10),
    isDraft: false
  });
  const [studioDesign, setStudioDesign] = useState<Design>(DEFAULT_DESIGN);
  const [writeViewTab, setWriteViewTab] = useState<'compose' | 'preview'>('compose');
  const [templateNameInput, setTemplateNameInput] = useState<string>('');

  // Voice Note Recording
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Archive Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSender, setFilterSender] = useState<string>('all');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [archivePage, setArchivePage] = useState<number>(1);

  // Calendar State
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // Memories State
  const [memoryForm, setMemoryForm] = useState({
    title: '',
    caption: '',
    category: 'special-date',
    date: new Date().toISOString().slice(0, 10),
    photoData: ''
  });
  const [memorySearch, setMemorySearch] = useState<string>('');
  const [memoryCategoryFilter, setMemoryCategoryFilter] = useState<string>('all');

  // Supabase Live Settings Form
  const supabaseInfo = getActiveSupabaseInfo();
  const [customSupabaseUrl, setCustomSupabaseUrl] = useState<string>(supabaseInfo.url);
  const [customSupabaseKey, setCustomSupabaseKey] = useState<string>('');
  const [copiedSpecTab, setCopiedSpecTab] = useState<string>('');

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Persist language preference
  useEffect(() => {
    localStorage.setItem('happy_couple_lang', lang);
  }, [lang]);

  // Persist active session
  useEffect(() => {
    if (activeCoupleId) {
      localStorage.setItem('happy_couple_active_id', activeCoupleId);
    } else {
      localStorage.removeItem('happy_couple_active_id');
    }
    if (activeMemberRole) {
      localStorage.setItem('happy_couple_active_role', activeMemberRole);
    } else {
      localStorage.removeItem('happy_couple_active_role');
    }
  }, [activeCoupleId, activeMemberRole]);

  // Initial load: Fetch all spaces
  const reloadSpaces = async () => {
    const list = await dbFetchAllSpaces();
    setAllSpaces(list);
  };

  useEffect(() => {
    reloadSpaces();
  }, []);

  // Sync active coupleSpace
  useEffect(() => {
    if (!activeCoupleId) {
      setCoupleSpace(null);
      return;
    }
    const found = allSpaces.find(s => s.id === activeCoupleId);
    if (found) {
      setCoupleSpace(found);
      if (found.websiteTitle) {
        document.title = found.websiteTitle;
      }
    }
  }, [activeCoupleId, allSpaces]);

  // Reload current couple's messages, templates, and memories
  const reloadCoupleData = async () => {
    if (!activeCoupleId) return;
    const [msgs, tpls, mems] = await Promise.all([
      dbFetchMessages(activeCoupleId),
      dbFetchTemplates(activeCoupleId),
      dbFetchMemories(activeCoupleId)
    ]);
    setCoupleMessages(msgs);
    setCoupleTemplates(tpls);
    setCoupleMemories(mems);
  };

  useEffect(() => {
    if (activeCoupleId) {
      reloadCoupleData();
      // Setup Realtime Live Channel
      const unsubscribe = subscribeToCoupleRealtime(activeCoupleId, () => {
        reloadCoupleData();
        reloadSpaces();
      });
      return () => {
        unsubscribe();
      };
    }
  }, [activeCoupleId]);

  // Profiles
  const currentMember: Member | null = useMemo(() => {
    if (!coupleSpace || !activeMemberRole) return null;
    return coupleSpace.members?.[activeMemberRole] || null;
  }, [coupleSpace, activeMemberRole]);

  const partnerRole = activeMemberRole === 'partnerA' ? 'partnerB' : 'partnerA';
  const partnerMember: Member | null = useMemo(() => {
    if (!coupleSpace || !activeMemberRole) return null;
    return coupleSpace.members?.[partnerRole] || null;
  }, [coupleSpace, activeMemberRole, partnerRole]);

  // Active Website Theme
  const activeTheme: Theme = useMemo(() => {
    const themeId = coupleSpace?.activeThemeId || 'pink-romance';
    if (themeId === 'custom-theme' && coupleSpace?.customTheme) {
      const base = WEBSITE_THEMES.find(t => t.id === 'custom-theme') || WEBSITE_THEMES[0];
      return {
        ...base,
        accent: coupleSpace.customTheme.accent || base.accent,
        textPrimary: coupleSpace.customTheme.textPrimary || base.textPrimary,
        border: coupleSpace.customTheme.border || base.border
      };
    }
    return WEBSITE_THEMES.find(t => t.id === themeId) || WEBSITE_THEMES[0];
  }, [coupleSpace]);

  // --------------------------------------------------------------------------
  // AUTHENTICATION HANDLERS
  // --------------------------------------------------------------------------
  const handleCreateCoupleSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authForm.username.trim() || !authForm.password || !authForm.displayName.trim()) {
      setAuthError('Please enter a username, secret password, and display name.');
      return;
    }
    setAuthLoading(true);
    try {
      const cleanUsername = authForm.username.trim().toLowerCase();
      const spaces = await dbFetchAllSpaces();
      const usernameExists = spaces.some(
        s =>
          s.members?.partnerA?.username === cleanUsername ||
          s.members?.partnerB?.username === cleanUsername
      );
      if (usernameExists) {
        setAuthError('That username is already taken. Please choose another or sign in.');
        setAuthLoading(false);
        return;
      }

      const passwordHash = await hashSecret(authForm.password);
      const pairingCode = generatePairingCode();
      const newSpaceId = `couple_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

      const spacePayload: CoupleSpace = {
        id: newSpaceId,
        pairingCode,
        coupleName: authForm.coupleName.trim() || 'Our Little World',
        websiteTitle: authForm.websiteTitle.trim() || 'Happy Messages 💌',
        activeThemeId: 'pink-romance',
        createdAt: new Date().toISOString(),
        members: {
          partnerA: {
            username: cleanUsername,
            passwordHash,
            displayName: authForm.displayName.trim(),
            nickname: authForm.nickname.trim() || 'My Love',
            avatarEmoji: authForm.avatarEmoji || '👩‍❤️‍👨',
            avatarUrl: '',
            bubbleColor: '#e91e63',
            reminderTime: '20:00',
            remindersEnabled: true,
            joinedAt: new Date().toISOString()
          },
          partnerB: null
        }
      };

      await dbSaveCoupleSpace(spacePayload);

      // Seed a welcome keepsake message
      const welcomeMsg: Message = {
        id: `msg_${Date.now()}`,
        coupleId: newSpaceId,
        senderRole: 'partnerA',
        senderName: authForm.displayName.trim(),
        title: 'Welcome to Our Private Sanctuary 💌',
        body: `Hey ${authForm.nickname || 'My Love'},\n\nI created this private digital world just for the two of us. Here we can leave daily happy letters, design custom postcards, and save our favorite memories forever.\n\nShare our pairing code (${pairingCode}) so we can connect our hearts here!`,
        mood: 'romantic',
        isFavorite: true,
        isRead: false,
        isDraft: false,
        scheduledDate: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        design: { ...DEFAULT_DESIGN, layout: 'folded-envelope', sticker: '💌' },
        reactions: ['❤️', '✨'],
        replies: []
      };

      await dbSaveMessage(welcomeMsg);

      setAllSpaces(prev => [...prev, spacePayload]);
      setActiveCoupleId(newSpaceId);
      setActiveMemberRole('partnerA');
      showNotice(`Created your private sanctuary! Pairing code: ${pairingCode}`);
    } catch (err) {
      console.error(err);
      setAuthError('Could not create space. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleJoinWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const code = authForm.pairingCode.trim().toUpperCase();
    const cleanUsername = authForm.username.trim().toLowerCase();

    if (!code || !cleanUsername || !authForm.password || !authForm.displayName.trim()) {
      setAuthError('Please enter the 6-character pairing code, username, password, and your name.');
      return;
    }

    setAuthLoading(true);
    try {
      const spaces = await dbFetchAllSpaces();
      const targetSpace = spaces.find(s => s.pairingCode === code);
      if (!targetSpace) {
        setAuthError('Invalid pairing code. Please double-check the code from your partner.');
        setAuthLoading(false);
        return;
      }

      // STRICT 2-PERSON ENFORCEMENT
      if (targetSpace.members?.partnerB && targetSpace.members.partnerB.username) {
        setAuthError('Access Denied: This private couple space already has two registered partners.');
        setAuthLoading(false);
        return;
      }

      const usernameExists = spaces.some(
        s =>
          s.members?.partnerA?.username === cleanUsername ||
          s.members?.partnerB?.username === cleanUsername
      );
      if (usernameExists) {
        setAuthError('Username is already taken. Please pick a unique username.');
        setAuthLoading(false);
        return;
      }

      const passwordHash = await hashSecret(authForm.password);
      const updatedSpace: CoupleSpace = {
        ...targetSpace,
        members: {
          ...targetSpace.members,
          partnerB: {
            username: cleanUsername,
            passwordHash,
            displayName: authForm.displayName.trim(),
            nickname: authForm.nickname.trim() || 'My Person',
            avatarEmoji: authForm.avatarEmoji || '💖',
            avatarUrl: '',
            bubbleColor: '#8b5cf6',
            reminderTime: '20:00',
            remindersEnabled: true,
            joinedAt: new Date().toISOString()
          }
        }
      };

      await dbSaveCoupleSpace(updatedSpace);

      setAllSpaces(prev => prev.map(s => (s.id === updatedSpace.id ? updatedSpace : s)));
      setActiveCoupleId(updatedSpace.id);
      setActiveMemberRole('partnerB');
      showNotice(`Connected with ${targetSpace.members.partnerA?.displayName}! ❤️`);
    } catch (err) {
      console.error(err);
      setAuthError('Failed to join couple space.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginExisting = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const cleanUsername = authForm.username.trim().toLowerCase();
    if (!cleanUsername || !authForm.password) {
      setAuthError('Please enter both your username and secret password.');
      return;
    }

    setAuthLoading(true);
    try {
      const passwordHash = await hashSecret(authForm.password);
      const spaces = await dbFetchAllSpaces();
      let matchedSpace: CoupleSpace | null = null;
      let matchedRole: 'partnerA' | 'partnerB' | '' = '';

      for (const sp of spaces) {
        if (
          sp.members?.partnerA?.username === cleanUsername &&
          sp.members?.partnerA?.passwordHash === passwordHash
        ) {
          matchedSpace = sp;
          matchedRole = 'partnerA';
          break;
        }
        if (
          sp.members?.partnerB?.username === cleanUsername &&
          sp.members?.partnerB?.passwordHash === passwordHash
        ) {
          matchedSpace = sp;
          matchedRole = 'partnerB';
          break;
        }
      }

      if (!matchedSpace || !matchedRole) {
        setAuthError('Invalid username or password. This sanctuary is strictly private.');
        setAuthLoading(false);
        return;
      }

      setCoupleSpace(matchedSpace);
      setActiveCoupleId(matchedSpace.id);
      setActiveMemberRole(matchedRole);
      showNotice(`Welcome back, ${matchedSpace.members[matchedRole]?.displayName} ❤️`);
    } catch (err) {
      console.error(err);
      setAuthError('Sign-in error occurred.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setActiveCoupleId('');
    setActiveMemberRole('');
    setCoupleSpace(null);
    localStorage.removeItem('happy_couple_active_id');
    localStorage.removeItem('happy_couple_active_role');
  };

  // --------------------------------------------------------------------------
  // VOICE NOTE RECORDING
  // --------------------------------------------------------------------------
  const handleStartVoiceRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setMsgForm(prev => ({ ...prev, voiceData: reader.result as string }));
          showNotice('Voice note attached! 🎙️');
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      showNotice('Microphone permission not granted or unavailable.', 'error');
    }
  };

  const handleStopVoiceRecord = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --------------------------------------------------------------------------
  // MESSAGE CRUD
  // --------------------------------------------------------------------------
  const handleSaveOrSendMessage = async (asDraft = false) => {
    if (!activeCoupleId || !currentMember || !activeMemberRole) return;
    if (!msgForm.title.trim() && !msgForm.body.trim()) {
      showNotice('Please write a message title or note first.', 'error');
      return;
    }

    try {
      const designSnapshot: Design = JSON.parse(JSON.stringify(studioDesign));
      const messageId = editingMessageId || `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

      const payload: Message = {
        id: messageId,
        coupleId: activeCoupleId,
        senderRole: activeMemberRole,
        senderName: currentMember.displayName,
        title: msgForm.title.trim() || 'A Little Note For You',
        body: msgForm.body,
        mood: msgForm.mood,
        photoData: msgForm.photoData || '',
        voiceData: msgForm.voiceData || '',
        scheduledDate: msgForm.scheduledDate || new Date().toISOString().slice(0, 10),
        isDraft: asDraft,
        isFavorite: false,
        isRead: false,
        design: designSnapshot,
        reactions: [],
        replies: [],
        createdAt: new Date().toISOString()
      };

      await dbSaveMessage(payload);
      await reloadCoupleData();

      setEditingMessageId(null);
      setMsgForm({
        title: '',
        body: '',
        mood: 'romantic',
        photoData: '',
        voiceData: '',
        scheduledDate: new Date().toISOString().slice(0, 10),
        isDraft: false
      });
      showNotice(asDraft ? 'Draft saved!' : 'Love letter sent! 💌');
      setCurrentPage('home');
    } catch (err) {
      console.error(err);
      showNotice('Failed to save message.', 'error');
    }
  };

  const handleOpenMessageDetail = async (msg: Message) => {
    setOpenedMessageId(msg.id);
    if (!msg.isRead && msg.senderRole !== activeMemberRole) {
      const updated = { ...msg, isRead: true };
      await dbSaveMessage(updated);
      setCoupleMessages(prev => prev.map(m => (m.id === msg.id ? updated : m)));
    }
  };

  const handleToggleFavorite = async (msg: Message) => {
    const updated = { ...msg, isFavorite: !msg.isFavorite };
    await dbSaveMessage(updated);
    setCoupleMessages(prev => prev.map(m => (m.id === msg.id ? updated : m)));
  };

  const handleAddReaction = async (msg: Message, emoji: string) => {
    const existing = msg.reactions || [];
    const next = existing.includes(emoji)
      ? existing.filter(r => r !== emoji)
      : [...existing, emoji];
    const updated = { ...msg, reactions: next };
    await dbSaveMessage(updated);
    setCoupleMessages(prev => prev.map(m => (m.id === msg.id ? updated : m)));
  };

  const handleAddReply = async (msg: Message, text: string) => {
    if (!activeMemberRole) return;
    const nextReplies = [
      ...(msg.replies || []),
      {
        authorRole: activeMemberRole,
        authorName: currentMember?.nickname || currentMember?.displayName || 'Love',
        text,
        createdAt: new Date().toISOString()
      }
    ];
    const updated = { ...msg, replies: nextReplies };
    await dbSaveMessage(updated);
    setCoupleMessages(prev => prev.map(m => (m.id === msg.id ? updated : m)));
    showNotice('Private reply added ❤️');
  };

  const handleDeleteMessage = async (msgId: string) => {
    await dbDeleteMessage(msgId);
    if (openedMessageId === msgId) setOpenedMessageId(null);
    setCoupleMessages(prev => prev.filter(m => m.id !== msgId));
    showNotice('Message removed.');
  };

  const handleEditMessageStart = (msg: Message) => {
    setOpenedMessageId(null);
    setEditingMessageId(msg.id);
    setMsgForm({
      title: msg.title || '',
      body: msg.body || '',
      mood: msg.mood || 'romantic',
      photoData: msg.photoData || '',
      voiceData: msg.voiceData || '',
      scheduledDate: msg.scheduledDate || new Date().toISOString().slice(0, 10),
      isDraft: !!msg.isDraft
    });
    if (msg.design) {
      setStudioDesign({ ...DEFAULT_DESIGN, ...msg.design });
    }
    setCurrentPage('write');
  };

  // --------------------------------------------------------------------------
  // TEMPLATES & THEMES
  // --------------------------------------------------------------------------
  const handleSaveTemplate = async () => {
    if (!activeCoupleId) return;
    const name = templateNameInput.trim() || `Romantic Style ${coupleTemplates.length + 1}`;
    const newTpl: Template = {
      id: `tpl_${Date.now()}`,
      coupleId: activeCoupleId,
      name,
      design: JSON.parse(JSON.stringify(studioDesign)),
      createdAt: new Date().toISOString()
    };
    await dbSaveTemplate(newTpl);
    setCoupleTemplates(prev => [...prev, newTpl]);
    setTemplateNameInput('');
    showNotice(`Saved template "${name}"! 🎨`);
  };

  const handleDeleteTemplate = async (id: string) => {
    await dbDeleteTemplate(id);
    setCoupleTemplates(prev => prev.filter(t => t.id !== id));
    showNotice('Template removed.');
  };

  const handleSelectWebsiteTheme = async (themeId: string) => {
    if (!coupleSpace) return;
    const updated = { ...coupleSpace, activeThemeId: themeId };
    await dbSaveCoupleSpace(updated);
    setCoupleSpace(updated);
    showNotice('Website theme updated! 🌸');
  };

  const handleUpdateCustomTheme = async (updates: Partial<{ accent: string; textPrimary: string; border: string }>) => {
    if (!coupleSpace) return;
    const currentCustom = coupleSpace.customTheme || {
      accent: '#db2777',
      textPrimary: '#500724',
      border: '#f472b6'
    };
    const nextCustom = { ...currentCustom, ...updates };
    const updated = {
      ...coupleSpace,
      activeThemeId: 'custom-theme',
      customTheme: nextCustom
    };
    await dbSaveCoupleSpace(updated);
    setCoupleSpace(updated);
  };

  // --------------------------------------------------------------------------
  // MEMORIES
  // --------------------------------------------------------------------------
  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCoupleId || !memoryForm.title.trim()) return;
    const newMem: Memory = {
      id: `mem_${Date.now()}`,
      coupleId: activeCoupleId,
      title: memoryForm.title.trim(),
      caption: memoryForm.caption.trim(),
      category: memoryForm.category,
      date: memoryForm.date || new Date().toISOString().slice(0, 10),
      photoData: memoryForm.photoData || '',
      createdBy: currentMember?.displayName || 'Love',
      createdAt: new Date().toISOString()
    };
    await dbSaveMemory(newMem);
    setCoupleMemories(prev => [newMem, ...prev]);
    setMemoryForm({
      title: '',
      caption: '',
      category: 'special-date',
      date: new Date().toISOString().slice(0, 10),
      photoData: ''
    });
    showNotice('Saved to Our Little Memories! 📸');
  };

  const handleDeleteMemory = async (id: string) => {
    await dbDeleteMemory(id);
    setCoupleMemories(prev => prev.filter(m => m.id !== id));
    showNotice('Memory removed.');
  };

  // --------------------------------------------------------------------------
  // COMPUTED VIEWS
  // --------------------------------------------------------------------------
  const t = (TRANSLATIONS as any)[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ar';

  const todayStr = new Date().toISOString().slice(0, 10);
  const publishedMessages = useMemo(
    () => coupleMessages.filter(m => !m.isDraft),
    [coupleMessages]
  );
  const todaysMessages = useMemo(
    () => publishedMessages.filter(m => (m.scheduledDate || m.createdAt.slice(0, 10)) === todayStr),
    [publishedMessages, todayStr]
  );
  const favoriteMessages = useMemo(
    () => publishedMessages.filter(m => m.isFavorite),
    [publishedMessages]
  );
  const unreadCount = useMemo(
    () => publishedMessages.filter(m => !m.isRead && m.senderRole !== activeMemberRole).length,
    [publishedMessages, activeMemberRole]
  );

  const filteredArchive = useMemo(() => {
    return coupleMessages.filter(m => {
      if (filterStatus === 'drafts' && !m.isDraft) return false;
      if (filterStatus !== 'drafts' && m.isDraft) return false;
      if (filterStatus === 'unread' && m.isRead) return false;
      if (filterStatus === 'read' && !m.isRead) return false;
      if (filterStatus === 'favorites' && !m.isFavorite) return false;
      if (filterSender !== 'all' && m.senderRole !== filterSender) return false;
      if (filterMood !== 'all' && m.mood !== filterMood) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = m.title?.toLowerCase().includes(q);
        const inBody = m.body?.toLowerCase().includes(q);
        if (!inTitle && !inBody) return false;
      }
      return true;
    });
  }, [coupleMessages, filterStatus, filterSender, filterMood, searchQuery]);

  const openedMessageObj = useMemo(
    () => coupleMessages.find(m => m.id === openedMessageId) || null,
    [coupleMessages, openedMessageId]
  );

  // --------------------------------------------------------------------------
  // RENDER: AUTHENTICATION SCREEN (When locked or not paired)
  // --------------------------------------------------------------------------
  if (!activeCoupleId || !coupleSpace || !activeMemberRole) {
    return (
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-rose-50 via-pink-100 to-rose-200 text-slate-800"
      >
        <header className="max-w-md w-full mx-auto flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💌</span>
            <span className="font-serif font-bold text-lg text-rose-900">{t.appName}</span>
          </div>
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-white/70 shadow-xs border border-rose-200"
          >
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>
        </header>

        <main className="my-auto py-4 sm:py-8 max-w-md w-full mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-2">
                <Lock className="w-3.5 h-3.5" /> Strict Two-Person Private Sanctuary
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">{t.loginTitle}</h2>
              <p className="text-xs text-slate-600 mt-1">
                Protected by SHA-256 credential hashing & private couple space pairing.
              </p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-rose-50 border border-rose-200 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
                className={`py-2 px-1 rounded-xl transition ${
                  authTab === 'login' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-900 hover:bg-rose-100'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('create'); setAuthError(''); }}
                className={`py-2 px-1 rounded-xl transition ${
                  authTab === 'create' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-900 hover:bg-rose-100'
                }`}
              >
                New Space
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('join'); setAuthError(''); }}
                className={`py-2 px-1 rounded-xl transition ${
                  authTab === 'join' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-900 hover:bg-rose-100'
                }`}
              >
                Join Code
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form
              onSubmit={
                authTab === 'login'
                  ? handleLoginExisting
                  : authTab === 'create'
                  ? handleCreateCoupleSpace
                  : handleJoinWithCode
              }
              className="space-y-3.5"
            >
              {authTab === 'join' && (
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-slate-700">
                    {t.pairingCode}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={authForm.pairingCode}
                    onChange={(e) => setAuthForm({ ...authForm, pairingCode: e.target.value.toUpperCase() })}
                    placeholder="E.g. LUV789"
                    className="w-full px-4 py-2.5 rounded-xl bg-rose-50/50 border border-rose-300 font-mono text-center text-lg tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">{t.username}</label>
                <input
                  type="text"
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  placeholder="your_private_username"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700">{t.password}</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {authTab !== 'login' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700">{t.displayName}</label>
                      <input
                        type="text"
                        value={authForm.displayName}
                        onChange={(e) => setAuthForm({ ...authForm, displayName: e.target.value })}
                        placeholder="Alex"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700">{t.nickname}</label>
                      <input
                        type="text"
                        value={authForm.nickname}
                        onChange={(e) => setAuthForm({ ...authForm, nickname: e.target.value })}
                        placeholder="My Love ❤️"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  </div>

                  {authTab === 'create' && (
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-slate-700">{t.coupleTitle}</label>
                      <input
                        type="text"
                        value={authForm.coupleName}
                        onChange={(e) => setAuthForm({ ...authForm, coupleName: e.target.value })}
                        placeholder="Our Little Universe"
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700">Choose Avatar</label>
                    <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-rose-50/60 border border-rose-200 max-h-24 overflow-y-auto">
                      {ILLUSTRATED_AVATARS.map((em) => (
                        <button
                          type="button"
                          key={em}
                          onClick={() => setAuthForm({ ...authForm, avatarEmoji: em })}
                          className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition ${
                            authForm.avatarEmoji === em
                              ? 'bg-rose-600 text-white scale-110 shadow'
                              : 'hover:bg-white'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>
                  {authLoading
                    ? 'Unlocking Sanctuary...'
                    : authTab === 'login'
                    ? t.loginExisting
                    : authTab === 'create'
                    ? t.createSpace
                    : t.joinSpace}
                </span>
              </button>
            </form>
          </div>
        </main>

        <footer className="text-center text-xs text-rose-900/70 pb-2">
          Exclusively for two hearts • End-to-end space isolation • Zero public feeds
        </footer>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: AUTHENTICATED COUPLE SANCTUARY
  // --------------------------------------------------------------------------
  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen transition-all duration-500 ${activeTheme.dark ? 'dark' : ''}`}
      style={{
        background: activeTheme.bgGradient,
        color: activeTheme.textPrimary
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-18 md:bottom-5 right-5 z-50 px-4 py-2.5 rounded-2xl shadow-2xl text-white text-xs sm:text-sm font-semibold flex items-center gap-2 animate-bounce ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-rose-600'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{toast.text}</span>
        </div>
      )}

      {/* Envelope Modal Experience */}
      {openedMessageObj && (
        <EnvelopeExperienceModal
          message={openedMessageObj}
          coupleSpace={coupleSpace}
          currentMember={currentMember}
          onClose={() => setOpenedMessageId(null)}
          onAddReaction={handleAddReaction}
          onAddReply={handleAddReply}
          onToggleFavorite={handleToggleFavorite}
          onDeleteMessage={handleDeleteMessage}
          onEditMessage={handleEditMessageStart}
          reducedMotion={reducedMotion}
          lang={lang}
        />
      )}

      {/* Main Header */}
      <Header
        coupleSpace={coupleSpace}
        currentMember={currentMember}
        partnerMember={partnerMember}
        activeTheme={activeTheme}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lang={lang}
        setLang={setLang}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        unreadCount={unreadCount}
        favoriteCount={favoriteMessages.length}
        onLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Content Body (with bottom safe padding for mobile bottom bar) */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 pb-24 md:pb-12">
        {/* ===================================================================
            PAGE 1: HOME
           =================================================================== */}
        {currentPage === 'home' && (
          <div className="space-y-8 sm:space-y-10">
            {/* Hero Welcome Banner */}
            <section
              className="rounded-3xl p-6 sm:p-10 shadow-xl border relative overflow-hidden"
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
            >
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: activeTheme.accentSoft, color: activeTheme.accent }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{formatCustomDate(new Date().toISOString(), 'full', lang)}</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-serif font-bold">
                    {t.welcomeGreeting}, {currentMember?.nickname || currentMember?.displayName} ❤️
                  </h2>
                  <p className="text-sm sm:text-base opacity-85">
                    {t.welcomeSub}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage('write')}
                  className="px-6 py-3.5 rounded-2xl text-white font-semibold text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition"
                  style={{ backgroundColor: activeTheme.accent }}
                >
                  <Feather className="w-4 h-4" />
                  <span>{t.writeMessage}</span>
                </button>
              </div>
            </section>

            {/* Waiting for partner banner */}
            {!partnerMember && (
              <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-xl shrink-0">
                    💌
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{t.partnerWaiting}</h4>
                    <p className="text-xs opacity-75">Send this code to your partner so they can join our sanctuary.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <span className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 font-mono font-bold text-base sm:text-lg border border-amber-500/40 text-center flex-1 sm:flex-none">
                    {coupleSpace.pairingCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(coupleSpace.pairingCode);
                      showNotice('Pairing code copied to clipboard!');
                    }}
                    className="p-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-500 transition shrink-0"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Today's Messages Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-serif font-bold flex items-center gap-2">
                  <span>💌</span> {t.todaysMessages}
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-current/10 font-medium">
                  {todaysMessages.length} {todaysMessages.length === 1 ? 'letter' : 'letters'}
                </span>
              </div>

              {todaysMessages.length === 0 ? (
                <div
                  className="rounded-3xl p-8 sm:p-12 text-center border shadow-sm space-y-3"
                  style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
                >
                  <div className="text-4xl">💌</div>
                  <p className="text-sm opacity-80">{t.emptyToday}</p>
                  <button
                    type="button"
                    onClick={() => setCurrentPage('write')}
                    className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold shadow hover:scale-105 transition"
                    style={{ backgroundColor: activeTheme.accent }}
                  >
                    {t.writeMessage}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {todaysMessages.map(msg => (
                    <StyledMessageCard
                      key={msg.id}
                      message={msg}
                      design={msg.design}
                      senderProfile={coupleSpace.members[msg.senderRole]}
                      recipientProfile={coupleSpace.members[msg.senderRole === 'partnerA' ? 'partnerB' : 'partnerA']}
                      onOpenDetail={handleOpenMessageDetail}
                      onToggleFavorite={handleToggleFavorite}
                      reducedMotion={reducedMotion}
                      lang={lang}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Timeline: Recent letters */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-serif font-bold flex items-center gap-2">
                  <span>🕰️</span> {t.timeline}
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentPage('messages')}
                  className="text-xs font-semibold hover:underline"
                  style={{ color: activeTheme.accent }}
                >
                  View Archive →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {publishedMessages.slice(0, 6).map(msg => (
                  <StyledMessageCard
                    key={msg.id}
                    message={msg}
                    design={msg.design}
                    senderProfile={coupleSpace.members[msg.senderRole]}
                    recipientProfile={coupleSpace.members[msg.senderRole === 'partnerA' ? 'partnerB' : 'partnerA']}
                    onOpenDetail={handleOpenMessageDetail}
                    onToggleFavorite={handleToggleFavorite}
                    reducedMotion={reducedMotion}
                    lang={lang}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ===================================================================
            PAGE 2: WRITE / EDIT MESSAGE
           =================================================================== */}
        {currentPage === 'write' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                  <Feather className="w-5 h-5 text-rose-500" />
                  <span>{editingMessageId ? 'Edit Love Letter' : t.writeMessage}</span>
                </h2>
                <p className="text-xs opacity-75">Express your heart with custom layouts, voice notes, and photos.</p>
              </div>

              {/* Mobile View Toggle: Compose vs Preview */}
              <div className="lg:hidden flex rounded-2xl bg-current/10 p-1 text-xs font-semibold self-start">
                <button
                  type="button"
                  onClick={() => setWriteViewTab('compose')}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    writeViewTab === 'compose' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'opacity-70'
                  }`}
                >
                  Compose
                </button>
                <button
                  type="button"
                  onClick={() => setWriteViewTab('preview')}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                    writeViewTab === 'preview' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'opacity-70'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Preview Card
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form & Design Controls */}
              <div
                className={`lg:col-span-7 rounded-3xl p-5 sm:p-7 border shadow-lg space-y-5 ${
                  writeViewTab === 'preview' ? 'hidden lg:block' : 'block'
                }`}
                style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
              >
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold mb-1">{t.msgTitle}</label>
                  <input
                    type="text"
                    value={msgForm.title}
                    onChange={(e) => setMsgForm({ ...msgForm, title: e.target.value })}
                    placeholder="E.g. Reasons I Smiled Today..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800 border text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ borderColor: activeTheme.border }}
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-xs font-bold mb-1">{t.msgBody}</label>
                  <textarea
                    rows={6}
                    value={msgForm.body}
                    onChange={(e) => setMsgForm({ ...msgForm, body: e.target.value })}
                    placeholder="Write from the heart..."
                    className="w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-800 border text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-y leading-relaxed"
                    style={{ borderColor: activeTheme.border }}
                  />
                </div>

                {/* Mood Picker */}
                <div>
                  <label className="block text-xs font-bold mb-1.5">{t.mood}</label>
                  <div className="flex flex-wrap gap-1.5">
                    {MOOD_LIST.map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setMsgForm({ ...msgForm, mood: m.id })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                          msgForm.mood === m.id
                            ? 'bg-rose-500/20 border-rose-500 font-bold scale-105'
                            : 'border-current/10 hover:bg-current/5'
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attachments: Photo & Voice Note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Photo Upload with client compression */}
                  <div>
                    <label className="block text-xs font-bold mb-1">{t.attachPhoto}</label>
                    <label
                      className="w-full px-3 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800 border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90"
                      style={{ borderColor: activeTheme.border }}
                    >
                      <ImageIcon className="w-4 h-4 text-rose-500" />
                      <span>{msgForm.photoData ? 'Change Photo ✓' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const dataUrl = await compressImageFile(file);
                            setMsgForm(prev => ({ ...prev, photoData: dataUrl }));
                            showNotice('Photo attached! 📸');
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Voice Note Recorder */}
                  <div>
                    <label className="block text-xs font-bold mb-1">{t.recordVoice}</label>
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={handleStartVoiceRecord}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800 border text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-90"
                        style={{ borderColor: activeTheme.border }}
                      >
                        <Mic className="w-4 h-4 text-rose-500" />
                        <span>{msgForm.voiceData ? 'Re-record Voice ✓' : 'Record Audio'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStopVoiceRecord}
                        className="w-full px-3 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 animate-pulse"
                      >
                        <Square className="w-3.5 h-3.5 fill-white" />
                        <span>{t.stopRecording}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Voice Preview if attached */}
                {msgForm.voiceData && (
                  <div className="pt-1">
                    <AudioVoicePlayer voiceData={msgForm.voiceData} accentColor={activeTheme.accent} />
                  </div>
                )}

                {/* Scheduled Date */}
                <div>
                  <label className="block text-xs font-bold mb-1">Schedule / Date</label>
                  <input
                    type="date"
                    value={msgForm.scheduledDate}
                    onChange={(e) => setMsgForm({ ...msgForm, scheduledDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800 border text-sm"
                    style={{ borderColor: activeTheme.border }}
                  />
                </div>

                {/* Layout Quick Selector */}
                <div>
                  <label className="block text-xs font-bold mb-1.5">Card Layout Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {MESSAGE_LAYOUTS.map((lay) => (
                      <button
                        type="button"
                        key={lay.id}
                        onClick={() => setStudioDesign({ ...studioDesign, layout: lay.id })}
                        className={`p-2 rounded-xl text-xs font-medium border text-left flex items-center gap-1.5 transition ${
                          studioDesign.layout === lay.id
                            ? 'bg-rose-500/20 border-rose-500 font-bold shadow-xs'
                            : 'border-current/10 hover:bg-current/5'
                        }`}
                      >
                        <span className="text-base">{lay.icon}</span>
                        <span className="truncate">{lay.name.replace(/^\d+\.\s*/, '')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions: Save Draft & Send */}
                <div className="pt-4 border-t border-current/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => handleSaveOrSendMessage(true)}
                    className="px-4 py-2.5 rounded-2xl border text-xs font-semibold transition hover:bg-current/5"
                    style={{ borderColor: activeTheme.border }}
                  >
                    {t.saveDraft}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveOrSendMessage(false)}
                    className="px-6 py-2.5 rounded-2xl text-white font-semibold text-xs sm:text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition"
                    style={{ backgroundColor: activeTheme.accent }}
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.sendMessage}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Card Preview */}
              <div
                className={`lg:col-span-5 sticky top-24 space-y-4 ${
                  writeViewTab === 'compose' ? 'hidden lg:block' : 'block'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-rose-500" /> Live Card Preview
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-current/10 font-medium">
                    {MESSAGE_LAYOUTS.find(l => l.id === studioDesign.layout)?.name}
                  </span>
                </div>

                <StyledMessageCard
                  message={{
                    title: msgForm.title || 'Every Moment With You',
                    body: msgForm.body || 'Write your message on the left and watch this card transform in real time. Every layout, font, texture, and sticker will be preserved with your message forever. ❤️',
                    mood: msgForm.mood,
                    photoData: msgForm.photoData,
                    voiceData: msgForm.voiceData,
                    scheduledDate: msgForm.scheduledDate,
                    createdAt: new Date().toISOString(),
                    isFavorite: true
                  }}
                  design={studioDesign}
                  senderProfile={currentMember}
                  recipientProfile={partnerMember}
                  isPreview={true}
                  reducedMotion={reducedMotion}
                  lang={lang}
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 3: DESIGN STUDIO
           =================================================================== */}
        {currentPage === 'studio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                  <Palette className="w-5 h-5 text-rose-500" />
                  <span>{t.designStudio}</span>
                </h2>
                <p className="text-xs opacity-75">Customize borders, textures, wax seal stamps, and fonts.</p>
              </div>
              <button
                type="button"
                onClick={() => setStudioDesign(DEFAULT_DESIGN)}
                className="px-3 py-1.5 rounded-xl border text-xs font-medium hover:bg-current/5"
                style={{ borderColor: activeTheme.border }}
              >
                {t.resetDesign}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Studio Controls */}
              <div
                className="lg:col-span-7 rounded-3xl p-5 sm:p-7 border shadow-lg space-y-5"
                style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
              >
                {/* 12 Layout Picker */}
                <div>
                  <label className="block text-xs font-bold mb-2">12 Romantic Card Layouts</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MESSAGE_LAYOUTS.map((lay) => (
                      <div
                        key={lay.id}
                        onClick={() => setStudioDesign({ ...studioDesign, layout: lay.id })}
                        className={`p-3 rounded-2xl border cursor-pointer transition ${
                          studioDesign.layout === lay.id
                            ? 'bg-rose-500/15 border-rose-500 shadow-sm'
                            : 'border-current/10 hover:bg-current/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <span className="text-xl">{lay.icon}</span>
                          <span>{lay.name}</span>
                        </div>
                        <p className="text-[11px] opacity-75 mt-1">{lay.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colors & Gradient */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Card Background</label>
                    <input
                      type="color"
                      value={studioDesign.bgColor}
                      onChange={(e) =>
                        setStudioDesign({
                          ...studioDesign,
                          bgColor: e.target.value,
                          useGradient: false
                        })
                      }
                      className="w-full h-10 rounded-xl cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Border Accent Color</label>
                    <input
                      type="color"
                      value={studioDesign.borderColor}
                      onChange={(e) => setStudioDesign({ ...studioDesign, borderColor: e.target.value })}
                      className="w-full h-10 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>

                {/* Texture */}
                <div>
                  <label className="block text-xs font-bold mb-1.5">Background Texture</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['none', 'dots', 'lines', 'paper'].map((tex) => (
                      <button
                        type="button"
                        key={tex}
                        onClick={() => setStudioDesign({ ...studioDesign, bgTexture: tex })}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border capitalize transition ${
                          studioDesign.bgTexture === tex
                            ? 'bg-rose-500/20 border-rose-500'
                            : 'border-current/10 hover:bg-current/5'
                        }`}
                      >
                        {tex}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Font Family</label>
                    <select
                      value={studioDesign.fontFamily}
                      onChange={(e) => setStudioDesign({ ...studioDesign, fontFamily: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                      style={{ borderColor: activeTheme.border }}
                    >
                      <option value="Playfair Display, Georgia, serif">Playfair Serif</option>
                      <option value="Dancing Script, cursive">Dancing Handwriting</option>
                      <option value="Cairo, sans-serif">Cairo Modern</option>
                      <option value="Georgia, serif">Classic Georgia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Font Size ({studioDesign.fontSize}px)</label>
                    <input
                      type="range"
                      min={14}
                      max={26}
                      value={studioDesign.fontSize}
                      onChange={(e) => setStudioDesign({ ...studioDesign, fontSize: Number(e.target.value) })}
                      className="w-full accent-pink-600 mt-2"
                    />
                  </div>
                </div>

                {/* Wax Seal / Sticker */}
                <div>
                  <label className="block text-xs font-bold mb-1.5">Wax Seal Stamp / Sticker</label>
                  <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-current/5">
                    {['💌', '🌹', '💖', '👑', '🕊️', '✨', '🌸', '💍', '🥂', '🌙', '🧸', '🍰'].map((stk) => (
                      <button
                        type="button"
                        key={stk}
                        onClick={() => setStudioDesign({ ...studioDesign, sticker: stk })}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition ${
                          studioDesign.sticker === stk
                            ? 'bg-rose-600 text-white scale-110 shadow'
                            : 'hover:bg-white dark:hover:bg-slate-800'
                        }`}
                      >
                        {stk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Custom Template */}
                <div className="pt-3 border-t border-current/10 flex gap-2">
                  <input
                    type="text"
                    value={templateNameInput}
                    onChange={(e) => setTemplateNameInput(e.target.value)}
                    placeholder="Custom Template Name..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                    style={{ borderColor: activeTheme.border }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveTemplate}
                    className="px-4 py-2 rounded-xl text-white text-xs font-semibold shadow"
                    style={{ backgroundColor: activeTheme.accent }}
                  >
                    {t.saveTemplate}
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="lg:col-span-5 sticky top-24 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-rose-500" /> Studio Live Preview
                </span>
                <StyledMessageCard
                  message={{
                    title: 'Our Signature Style',
                    body: 'This preview reflects your active design studio settings. Save it as your couple template or apply it when writing love letters.',
                    mood: 'romantic',
                    createdAt: new Date().toISOString()
                  }}
                  design={studioDesign}
                  senderProfile={currentMember}
                  recipientProfile={partnerMember}
                  isPreview={true}
                  reducedMotion={reducedMotion}
                  lang={lang}
                />
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 4: THEMES
           =================================================================== */}
        {currentPage === 'themes' && (
          <div className="space-y-6">
            <div
              className="rounded-3xl p-6 border shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
            >
              <div>
                <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                  <span>🌸</span> Sanctuary Theme Library
                </h2>
                <p className="text-xs opacity-75">
                  Switch between 14 romantic presets or customize your couple palette.
                </p>
              </div>
              <span
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: activeTheme.accent }}
              >
                Active: {lang === 'ar' ? activeTheme.nameAr : activeTheme.name} {activeTheme.emoji}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WEBSITE_THEMES.map((thm) => {
                const isSelected = (coupleSpace.activeThemeId || 'pink-romance') === thm.id;
                return (
                  <div
                    key={thm.id}
                    onClick={() => handleSelectWebsiteTheme(thm.id)}
                    className={`cursor-pointer rounded-3xl p-5 border-2 transition-all hover:scale-[1.02] shadow-md ${
                      isSelected ? 'ring-4 ring-rose-500/40' : ''
                    }`}
                    style={{
                      background: thm.bgGradient,
                      color: thm.textPrimary,
                      borderColor: isSelected ? thm.accent : thm.border
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{thm.emoji}</span>
                      {isSelected && (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: thm.accent }}
                        >
                          Active ✓
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-base">
                      {lang === 'ar' ? thm.nameAr : thm.name}
                    </h3>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border shadow-xs" style={{ backgroundColor: thm.accent }} />
                      <span className="w-5 h-5 rounded-full border shadow-xs" style={{ backgroundColor: thm.textPrimary }} />
                      <span className="w-5 h-5 rounded-full border shadow-xs" style={{ backgroundColor: thm.border }} />
                      <span className="ml-auto text-xs font-semibold underline">Apply Theme</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Theme Color Controls */}
            <div
              className="rounded-3xl p-5 border shadow-lg space-y-3"
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
            >
              <h3 className="font-serif font-bold text-base">🎨 Customize "Custom Couple Theme"</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Primary Accent Color</label>
                  <input
                    type="color"
                    value={coupleSpace.customTheme?.accent || '#db2777'}
                    onChange={(e) => handleUpdateCustomTheme({ accent: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Primary Text Color</label>
                  <input
                    type="color"
                    value={coupleSpace.customTheme?.textPrimary || '#500724'}
                    onChange={(e) => handleUpdateCustomTheme({ textPrimary: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Border & Frame Color</label>
                  <input
                    type="color"
                    value={coupleSpace.customTheme?.border || '#f472b6'}
                    onChange={(e) => handleUpdateCustomTheme({ border: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 5: ARCHIVE & SEARCH
           =================================================================== */}
        {currentPage === 'messages' && (
          <div className="space-y-6">
            <div
              className="rounded-3xl p-5 sm:p-6 border shadow-md space-y-4"
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-serif font-bold">Our Message Archive 💌</h2>
                  <p className="text-xs opacity-75">Search and filter every love letter and voice note we shared.</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow self-start"
                  style={{ backgroundColor: activeTheme.accent }}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.exportPrint}</span>
                </button>
              </div>

              {/* Search Bar & Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="relative sm:col-span-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 opacity-50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                    style={{ borderColor: activeTheme.border }}
                  />
                </div>

                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                    style={{ borderColor: activeTheme.border }}
                  >
                    <option value="all">{t.allStatuses}</option>
                    <option value="unread">{t.unread}</option>
                    <option value="read">{t.read}</option>
                    <option value="favorites">{t.favorite}</option>
                    <option value="drafts">Drafts</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterMood}
                    onChange={(e) => setFilterMood(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                    style={{ borderColor: activeTheme.border }}
                  >
                    <option value="all">{t.allMoods}</option>
                    {MOOD_LIST.map(m => (
                      <option key={m.id} value={m.id}>{m.emoji} {m.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredArchive.length === 0 ? (
              <div
                className="rounded-3xl p-12 text-center border shadow-sm space-y-2"
                style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
              >
                <div className="text-3xl">🔍</div>
                <p className="text-sm opacity-80">No messages match your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredArchive.map((msg) => (
                  <StyledMessageCard
                    key={msg.id}
                    message={msg}
                    design={msg.design}
                    senderProfile={coupleSpace.members[msg.senderRole]}
                    recipientProfile={coupleSpace.members[msg.senderRole === 'partnerA' ? 'partnerB' : 'partnerA']}
                    onOpenDetail={handleOpenMessageDetail}
                    onToggleFavorite={handleToggleFavorite}
                    reducedMotion={reducedMotion}
                    lang={lang}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            PAGE 6: CALENDAR
           =================================================================== */}
        {currentPage === 'calendar' && (
          <div className="space-y-6">
            <div
              className="rounded-3xl p-6 border shadow-lg space-y-4"
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-rose-500" />
                    <span>{t.littleCalendar}</span>
                  </h2>
                  <p className="text-xs opacity-75">Every day we shared words of love.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
                    }
                    className="p-2 rounded-xl border hover:bg-current/5"
                    style={{ borderColor: activeTheme.border }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-serif font-bold text-sm sm:text-base min-w-[120px] text-center">
                    {calendarMonth.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
                    }
                    className="p-2 rounded-xl border hover:bg-current/5"
                    style={{ borderColor: activeTheme.border }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Monthly Grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold pt-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="py-1.5 opacity-60 text-[11px] uppercase tracking-wider">{d}</div>
                ))}
                {Array.from({ length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}
                {Array.from({
                  length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()
                }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const dayMsgs = publishedMessages.filter(
                    m => (m.scheduledDate || m.createdAt.slice(0, 10)) === dateStr
                  );
                  const isSelected = selectedCalendarDate === dateStr;
                  return (
                    <div
                      key={dayNum}
                      onClick={() => setSelectedCalendarDate(dateStr)}
                      className={`p-2 sm:p-3 rounded-2xl border cursor-pointer transition min-h-[50px] sm:min-h-[64px] flex flex-col items-center justify-between ${
                        isSelected
                          ? 'ring-2 ring-rose-500 bg-rose-500/15'
                          : 'border-current/10 hover:bg-current/5'
                      }`}
                    >
                      <span className="text-xs font-bold">{dayNum}</span>
                      {dayMsgs.length > 0 && (
                        <div className="flex gap-0.5 mt-1">
                          {dayMsgs.slice(0, 3).map((_, idx) => (
                            <span key={idx} className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Messages */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg">
                Messages on {formatCustomDate(selectedCalendarDate, 'full', lang)}:
              </h3>
              {publishedMessages.filter(
                m => (m.scheduledDate || m.createdAt.slice(0, 10)) === selectedCalendarDate
              ).length === 0 ? (
                <p className="text-xs opacity-60 italic">No letters on this date. Click Write to create one!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publishedMessages
                    .filter(m => (m.scheduledDate || m.createdAt.slice(0, 10)) === selectedCalendarDate)
                    .map(msg => (
                      <StyledMessageCard
                        key={msg.id}
                        message={msg}
                        design={msg.design}
                        senderProfile={coupleSpace.members[msg.senderRole]}
                        recipientProfile={coupleSpace.members[msg.senderRole === 'partnerA' ? 'partnerB' : 'partnerA']}
                        onOpenDetail={handleOpenMessageDetail}
                        onToggleFavorite={handleToggleFavorite}
                        reducedMotion={reducedMotion}
                        lang={lang}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 7: MEMORIES VAULT
           =================================================================== */}
        {currentPage === 'memories' && (
          <div className="space-y-6">
            <div
              className="rounded-3xl p-5 sm:p-7 border shadow-lg space-y-4"
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                    <Camera className="w-5 h-5 text-rose-500" />
                    <span>{t.memoriesVault}</span>
                  </h2>
                  <p className="text-xs opacity-75">Save our milestones, first dates, trips, and little inside jokes.</p>
                </div>
              </div>

              {/* Add Memory Form */}
              <form onSubmit={handleAddMemory} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={memoryForm.title}
                    onChange={(e) => setMemoryForm({ ...memoryForm, title: e.target.value })}
                    placeholder="Memory Title (e.g. Our First Rainy Cafe Date)..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                    style={{ borderColor: activeTheme.border }}
                  />
                  <input
                    type="date"
                    value={memoryForm.date}
                    onChange={(e) => setMemoryForm({ ...memoryForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                    style={{ borderColor: activeTheme.border }}
                  />
                </div>

                <textarea
                  rows={2}
                  value={memoryForm.caption}
                  onChange={(e) => setMemoryForm({ ...memoryForm, caption: e.target.value })}
                  placeholder="A sweet caption or story..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                  style={{ borderColor: activeTheme.border }}
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <label
                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{ borderColor: activeTheme.border }}
                  >
                    <ImageIcon className="w-4 h-4 text-rose-500" />
                    <span>{memoryForm.photoData ? 'Change Photo ✓' : 'Attach Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const dataUrl = await compressImageFile(file);
                          setMemoryForm(prev => ({ ...prev, photoData: dataUrl }));
                          showNotice('Memory photo attached!');
                        }
                      }}
                    />
                  </label>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-white text-xs font-semibold shadow hover:scale-105 transition"
                    style={{ backgroundColor: activeTheme.accent }}
                  >
                    {t.addMemory}
                  </button>
                </div>
              </form>
            </div>

            {/* Memories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {coupleMemories.map((mem) => (
                <div
                  key={mem.id}
                  className="rounded-3xl border shadow-md overflow-hidden flex flex-col"
                  style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
                >
                  {mem.photoData && (
                    <div className="w-full h-48 bg-slate-900 overflow-hidden">
                      <img src={mem.photoData} alt={mem.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-[11px] opacity-70 mb-1">
                        <span>{formatCustomDate(mem.date, 'short', lang)}</span>
                        <span className="capitalize">{mem.category.replace('-', ' ')}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base">{mem.title}</h4>
                      {mem.caption && <p className="text-xs opacity-85 mt-1 leading-relaxed">{mem.caption}</p>}
                    </div>
                    <div className="pt-2 flex items-center justify-between text-[11px] opacity-60">
                      <span>Saved by {mem.createdBy}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMemory(mem.id)}
                        className="text-rose-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 8: FAVORITES
           =================================================================== */}
        {currentPage === 'favorites' && (
          <div className="space-y-6">
            <div
              className="rounded-3xl p-6 border shadow-md"
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
            >
              <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>{t.ourFavorites}</span>
              </h2>
              <p className="text-xs opacity-75 mt-1">Our most cherished love notes and keepsake letters.</p>
            </div>

            {favoriteMessages.length === 0 ? (
              <div
                className="rounded-3xl p-12 text-center border shadow-sm space-y-2"
                style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
              >
                <div className="text-3xl">⭐</div>
                <p className="text-sm opacity-80">No favorites yet. Star any letter to save it here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {favoriteMessages.map((msg) => (
                  <StyledMessageCard
                    key={msg.id}
                    message={msg}
                    design={msg.design}
                    senderProfile={coupleSpace.members[msg.senderRole]}
                    recipientProfile={coupleSpace.members[msg.senderRole === 'partnerA' ? 'partnerB' : 'partnerA']}
                    onOpenDetail={handleOpenMessageDetail}
                    onToggleFavorite={handleToggleFavorite}
                    reducedMotion={reducedMotion}
                    lang={lang}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            PAGE 9: SETTINGS & SUPABASE
           =================================================================== */}
        {currentPage === 'settings' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Supabase Connection Card */}
            <div
              className="rounded-3xl p-6 sm:p-7 border shadow-lg space-y-4"
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <Database className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-serif font-bold text-lg">Supabase Cloud Database & Realtime</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isSupabaseConnected()
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {isSupabaseConnected() ? '● Live Supabase Connected' : '○ Local Offline Fallback Mode'}
                </span>
              </div>

              <p className="text-xs opacity-80 leading-relaxed">
                Connect your Supabase project to synchronize love letters and reactions between your phones in real time.
                If you already set <code className="px-1.5 py-0.5 rounded bg-black/10">VITE_SUPABASE_URL</code> in your environment or Vercel, it connects automatically.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold mb-1">Supabase Project URL</label>
                  <input
                    type="text"
                    value={customSupabaseUrl}
                    onChange={(e) => setCustomSupabaseUrl(e.target.value)}
                    placeholder="https://your-project-id.supabase.co"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border text-xs font-mono"
                    style={{ borderColor: activeTheme.border }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Supabase Anon Key</label>
                  <input
                    type="password"
                    value={customSupabaseKey}
                    onChange={(e) => setCustomSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border text-xs font-mono"
                    style={{ borderColor: activeTheme.border }}
                  />
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!customSupabaseUrl || !customSupabaseKey) {
                        showNotice('Please enter both Supabase URL and Anon Key', 'error');
                        return;
                      }
                      saveSupabaseCustomConfig(customSupabaseUrl, customSupabaseKey);
                    }}
                    className="px-5 py-2 rounded-xl text-white text-xs font-semibold shadow hover:scale-105 transition"
                    style={{ backgroundColor: activeTheme.accent }}
                  >
                    Save & Connect Supabase
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      saveSupabaseCustomConfig('', '');
                      setCustomSupabaseUrl('');
                      setCustomSupabaseKey('');
                      showNotice('Cleared custom Supabase configuration');
                    }}
                    className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-current/5"
                    style={{ borderColor: activeTheme.border }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Couple Profile & Personalization */}
            <div
              className="rounded-3xl p-6 sm:p-7 border shadow-lg space-y-4"
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
            >
              <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-rose-500" />
                <span>Sanctuary Personalization</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">{t.coupleTitle}</label>
                  <input
                    type="text"
                    value={coupleSpace.coupleName}
                    onChange={(e) => {
                      const updated = { ...coupleSpace, coupleName: e.target.value };
                      setCoupleSpace(updated);
                      dbSaveCoupleSpace(updated);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                    style={{ borderColor: activeTheme.border }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">{t.websiteTitle}</label>
                  <input
                    type="text"
                    value={coupleSpace.websiteTitle}
                    onChange={(e) => {
                      const updated = { ...coupleSpace, websiteTitle: e.target.value };
                      setCoupleSpace(updated);
                      dbSaveCoupleSpace(updated);
                      document.title = e.target.value;
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border text-xs"
                    style={{ borderColor: activeTheme.border }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-current/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">Pairing Code:</div>
                  <div className="text-base font-mono font-bold text-rose-500">{coupleSpace.pairingCode}</div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow hover:bg-rose-500 transition flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.logout}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            PAGE 10: DB & SECURITY SPEC
           =================================================================== */}
        {currentPage === 'blueprint' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div
              className="rounded-3xl p-6 sm:p-7 border shadow-lg space-y-4"
              style={{ backgroundColor: activeTheme.cardBg, borderColor: activeTheme.border }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                    Production Architecture & PostgreSQL Migration
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold mt-2">
                    Supabase PostgreSQL Schema & Security Spec
                  </h2>
                </div>
              </div>

              {/* Security Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" /> Two-Member Cap
                  </div>
                  <p className="opacity-80">Pairing code strictly links partnerA and partnerB. 3rd users are rejected.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" /> SHA-256 Hashing
                  </div>
                  <p className="opacity-80">Passwords are salted and hashed via WebCrypto before storing in database.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" /> Realtime Sync
                  </div>
                  <p className="opacity-80">Supabase Realtime publication pushes new messages instantly to partner phone.</p>
                </div>
              </div>

              {/* SQL Migration Script */}
              <div className="pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold opacity-80 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" /> supabase/schema.sql
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.couple_spaces (
  id TEXT PRIMARY KEY,
  pairing_code VARCHAR(12) NOT NULL UNIQUE,
  couple_name TEXT NOT NULL DEFAULT 'Our Little World',
  website_title TEXT NOT NULL DEFAULT 'Happy Messages 💌',
  active_theme_id TEXT NOT NULL DEFAULT 'pink-romance',
  custom_theme JSONB DEFAULT '{}'::jsonb,
  members JSONB NOT NULL DEFAULT '{"partnerA": null, "partnerB": null}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.couple_messages (
  id TEXT PRIMARY KEY,
  couple_id TEXT NOT NULL REFERENCES public.couple_spaces(id) ON DELETE CASCADE,
  sender_role VARCHAR(20) NOT NULL,
  sender_name TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  mood VARCHAR(40) DEFAULT 'romantic',
  photo_data TEXT DEFAULT '',
  voice_data TEXT DEFAULT '',
  scheduled_date VARCHAR(20) NOT NULL,
  is_draft BOOLEAN NOT NULL DEFAULT FALSE,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  design JSONB NOT NULL DEFAULT '{}'::jsonb,
  reactions JSONB NOT NULL DEFAULT '[]'::jsonb,
  replies JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.couple_templates (
  id TEXT PRIMARY KEY,
  couple_id TEXT NOT NULL REFERENCES public.couple_spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  design JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.couple_memories (
  id TEXT PRIMARY KEY,
  couple_id TEXT NOT NULL REFERENCES public.couple_spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  caption TEXT DEFAULT '',
  category VARCHAR(60) DEFAULT 'special-date',
  date VARCHAR(20) NOT NULL,
  photo_data TEXT DEFAULT '',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.couple_messages, public.couple_spaces, public.couple_memories;

ALTER TABLE public.couple_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public couple_spaces" ON public.couple_spaces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public couple_messages" ON public.couple_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public couple_templates" ON public.couple_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public couple_memories" ON public.couple_memories FOR ALL USING (true) WITH CHECK (true);`);
                      setCopiedSpecTab('sql');
                      showNotice('Copied SQL Migration to clipboard!');
                      setTimeout(() => setCopiedSpecTab(''), 2500);
                    }}
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-rose-500"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedSpecTab === 'sql' ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 text-[11px] font-mono overflow-x-auto max-h-64 leading-relaxed">
{`-- Paste this directly into Supabase Dashboard -> SQL Editor -> Run
CREATE TABLE public.couple_spaces (...);
CREATE TABLE public.couple_messages (...);
CREATE TABLE public.couple_templates (...);
CREATE TABLE public.couple_memories (...);
ALTER PUBLICATION supabase_realtime ADD TABLE couple_messages, couple_spaces, couple_memories;`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modern Mobile Bottom Navigation */}
      <BottomNavigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        unreadCount={unreadCount}
        favoriteCount={favoriteMessages.length}
        activeTheme={activeTheme}
        lang={lang}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </div>
  );
}
