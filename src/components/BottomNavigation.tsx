import React from 'react';
import {
  Heart, Feather, Mail, Camera, Menu, Palette, Sparkles,
  Calendar as CalendarIcon, Star, Settings, Shield, X
} from 'lucide-react';
import { PageId, Theme } from '../types';
import { TRANSLATIONS } from '../constants';

interface BottomNavigationProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  unreadCount: number;
  favoriteCount: number;
  activeTheme: Theme;
  lang: 'en' | 'ar';
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentPage,
  setCurrentPage,
  unreadCount,
  favoriteCount,
  activeTheme,
  lang,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const t = (TRANSLATIONS as any)[lang] || TRANSLATIONS.en;

  const mainTabs = [
    { id: 'home' as PageId, label: t.navHome, icon: Heart },
    { id: 'write' as PageId, label: t.navWrite, icon: Feather },
    { id: 'messages' as PageId, label: t.navMessages, icon: Mail, badge: unreadCount },
    { id: 'memories' as PageId, label: t.navMemories, icon: Camera },
  ];

  const drawerTabs = [
    { id: 'studio' as PageId, label: t.navStudio, icon: Palette },
    { id: 'themes' as PageId, label: t.navThemes, icon: Sparkles },
    { id: 'calendar' as PageId, label: t.navCalendar, icon: CalendarIcon },
    { id: 'favorites' as PageId, label: t.navFavorites, icon: Star, badge: favoriteCount },
    { id: 'settings' as PageId, label: t.navSettings, icon: Settings },
    { id: 'blueprint' as PageId, label: t.navBlueprint, icon: Shield },
  ];

  const isDrawerActive = drawerTabs.some(item => item.id === currentPage);

  return (
    <>
      {/* Mobile Slide-Up Drawer for Additional Pages */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div
            className="w-full rounded-t-3xl p-5 border-t shadow-2xl max-h-[75vh] overflow-y-auto animate-slide-up"
            style={{
              backgroundColor: activeTheme.cardBg,
              borderColor: activeTheme.border,
              color: activeTheme.textPrimary
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
              <span className="font-serif font-bold text-base flex items-center gap-2">
                <span>✨</span> More Sanctuary Spaces
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-current/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {drawerTabs.map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold border transition ${
                      active
                        ? 'shadow-sm text-white'
                        : 'border-current/10 hover:bg-current/5'
                    }`}
                    style={
                      active
                        ? { backgroundColor: activeTheme.accent, borderColor: activeTheme.accent }
                        : {}
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] bg-rose-600 text-white font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modern Fixed Bottom Tab Bar for Mobile Devices */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t backdrop-blur-lg pb-safe transition-colors"
        style={{
          backgroundColor: activeTheme.cardBg,
          borderColor: activeTheme.border
        }}
      >
        <div className="grid grid-cols-5 h-14">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentPage === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setCurrentPage(tab.id);
                  setMobileMenuOpen(false);
                }}
                className="relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-transform active:scale-90"
                style={{
                  color: active ? activeTheme.accent : undefined,
                  opacity: active ? 1 : 0.65
                }}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span>{tab.label}</span>
                {active && (
                  <span
                    className="absolute bottom-1 w-1 h-1 rounded-full"
                    style={{ backgroundColor: activeTheme.accent }}
                  />
                )}
              </button>
            );
          })}

          {/* 5th Tab: Menu / More */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-transform active:scale-90"
            style={{
              color: isDrawerActive ? activeTheme.accent : undefined,
              opacity: isDrawerActive || mobileMenuOpen ? 1 : 0.65
            }}
          >
            <Menu className={`w-5 h-5 ${isDrawerActive ? 'stroke-[2.5]' : ''}`} />
            <span>More</span>
            {isDrawerActive && (
              <span
                className="absolute bottom-1 w-1 h-1 rounded-full"
                style={{ backgroundColor: activeTheme.accent }}
              />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
