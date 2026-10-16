import React from 'react';
import {
  Heart, Feather, Palette, Sparkles, Mail, Calendar as CalendarIcon,
  Camera, Star, Settings, Shield, Globe, LogOut, Key, Database, Menu, X
} from 'lucide-react';
import { CoupleSpace, Member, PageId, Theme } from '../types';
import { TRANSLATIONS } from '../constants';
import { isSupabaseConnected } from '../lib/supabase';

interface HeaderProps {
  coupleSpace: CoupleSpace;
  currentMember: Member | null;
  partnerMember: Member | null;
  activeTheme: Theme;
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  unreadCount: number;
  favoriteCount: number;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  coupleSpace,
  currentMember,
  partnerMember,
  activeTheme,
  currentPage,
  setCurrentPage,
  lang,
  setLang,
  reducedMotion,
  setReducedMotion,
  unreadCount,
  favoriteCount,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const t = (TRANSLATIONS as any)[lang] || TRANSLATIONS.en;
  const isSupabaseOnline = isSupabaseConnected();

  const navItems = [
    { id: 'home' as PageId, label: t.navHome, icon: Heart },
    { id: 'write' as PageId, label: t.navWrite, icon: Feather },
    { id: 'studio' as PageId, label: t.navStudio, icon: Palette },
    { id: 'themes' as PageId, label: t.navThemes, icon: Sparkles },
    { id: 'messages' as PageId, label: t.navMessages, icon: Mail, badge: unreadCount },
    { id: 'calendar' as PageId, label: t.navCalendar, icon: CalendarIcon },
    { id: 'memories' as PageId, label: t.navMemories, icon: Camera },
    { id: 'favorites' as PageId, label: t.navFavorites, icon: Star, badge: favoriteCount },
    { id: 'settings' as PageId, label: t.navSettings, icon: Settings },
    { id: 'blueprint' as PageId, label: t.navBlueprint, icon: Shield }
  ];

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md border-b transition-colors"
      style={{
        backgroundColor: activeTheme.cardBg,
        borderColor: activeTheme.border
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Couple Names */}
        <div
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0"
        >
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-white shadow-md text-base sm:text-lg shrink-0 overflow-hidden"
            style={{ backgroundColor: activeTheme.accent }}
          >
            {currentMember?.avatarUrl ? (
              <img
                src={currentMember.avatarUrl}
                alt={currentMember.displayName || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              currentMember?.avatarEmoji || '💌'
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-serif font-bold text-base sm:text-lg leading-tight truncate">
                {coupleSpace.websiteTitle || t.appName}
              </h1>
              <span
                className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-semibold truncate hidden xs:inline-block"
                style={{ backgroundColor: activeTheme.accentSoft, color: activeTheme.accent }}
              >
                {coupleSpace.coupleName}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs opacity-75 truncate">
              {currentMember?.nickname || currentMember?.displayName} ❤️ {partnerMember?.nickname || partnerMember?.displayName || 'Waiting for Partner'}
            </p>
          </div>
        </div>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* User Profile Avatar Pill */}
          <button
            type="button"
            onClick={() => setCurrentPage('settings')}
            className={`flex items-center gap-1.5 p-1 rounded-full border transition hover:scale-105 active:scale-95 ${
              currentPage === 'settings' ? 'ring-2 ring-rose-400' : ''
            }`}
            style={{
              borderColor: activeTheme.border,
              backgroundColor: activeTheme.cardBg
            }}
            title={lang === 'ar' ? 'تعديل صورتك الشخصية والإعدادات' : 'Profile & Settings'}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-rose-500/20 flex items-center justify-center text-xs sm:text-sm font-bold border border-rose-400/40 shrink-0">
              {currentMember?.avatarUrl ? (
                <img
                  src={currentMember.avatarUrl}
                  alt={currentMember.displayName || 'Avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{currentMember?.avatarEmoji || '👤'}</span>
              )}
            </div>
            <span className="text-[11px] sm:text-xs font-semibold max-w-[70px] truncate hidden sm:inline px-1">
              {currentMember?.nickname || currentMember?.displayName}
            </span>
          </button>

          {/* Supabase status badge */}
          <div
            onClick={() => setCurrentPage('settings')}
            className={`cursor-pointer px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold flex items-center gap-1 border transition ${
              isSupabaseOnline
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300'
            }`}
            title={isSupabaseOnline ? 'Connected to Supabase PostgreSQL Realtime' : 'Local mode: Click to configure Supabase'}
          >
            <Database className="w-3 h-3" />
            <span className="hidden sm:inline">{isSupabaseOnline ? 'Supabase Live' : 'Local Cache'}</span>
          </div>

          {/* Pairing Code Pill if partner hasn't joined */}
          {!partnerMember && (
            <div className="px-2 sm:px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1 text-pink-700 dark:text-pink-300">
              <Key className="w-3 h-3" />
              <span>{coupleSpace.pairingCode}</span>
            </div>
          )}

          {/* Reduced Motion Toggle (hidden on small phones) */}
          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            className="hidden sm:flex px-2.5 py-1.5 rounded-full text-xs font-medium border transition opacity-85 hover:opacity-100"
            style={{ borderColor: activeTheme.border }}
            title={t.reducedMotion}
          >
            {reducedMotion ? 'Motion: Off' : '✨ Motion: On'}
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-2.5 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1 transition"
            style={{ borderColor: activeTheme.border }}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          {/* Logout Lock */}
          <button
            type="button"
            onClick={onLogout}
            className="px-2.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 flex items-center gap-1 transition"
            title={t.logout}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.logout}</span>
          </button>

          {/* Mobile Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl border transition"
            style={{ borderColor: activeTheme.border }}
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Horizontal Navigation Bar */}
      <nav className="hidden md:flex max-w-7xl mx-auto px-4 py-1.5 items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-current/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                active ? 'shadow-sm scale-[1.02]' : 'opacity-75 hover:opacity-100'
              }`}
              style={
                active
                  ? { backgroundColor: activeTheme.accent, color: '#ffffff' }
                  : { backgroundColor: 'transparent' }
              }
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-rose-600 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
