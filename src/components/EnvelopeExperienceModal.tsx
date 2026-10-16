import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X, Heart, Star, Sparkles, Send, Trash2, Edit3, MailOpen, RefreshCw, Printer
} from 'lucide-react';
import { Message, CoupleSpace, Member } from '../types';
import { TRANSLATIONS } from '../constants';
import { StyledMessageCard } from './StyledMessageCard';

interface EnvelopeExperienceModalProps {
  message: Message;
  coupleSpace: CoupleSpace | null;
  currentMember: Member | null;
  onClose: () => void;
  onAddReaction: (msg: Message, emoji: string) => void;
  onAddReply: (msg: Message, text: string) => void;
  onToggleFavorite: (msg: Message) => void;
  onDeleteMessage: (msgId: string) => void;
  onEditMessage: (msg: Message) => void;
  reducedMotion?: boolean;
  lang?: string;
}

const REACTION_EMOJIS = ['❤️', '🥺', '💌', '✨', '🌸', '🔥', '🥂', '🕊️'];

export const EnvelopeExperienceModal: React.FC<EnvelopeExperienceModalProps> = ({
  message,
  coupleSpace,
  currentMember,
  onClose,
  onAddReaction,
  onAddReply,
  onToggleFavorite,
  onDeleteMessage,
  onEditMessage,
  reducedMotion = false,
  lang = 'en'
}) => {
  const [stage, setStage] = useState<'sealed' | 'opening' | 'opened'>(
    reducedMotion ? 'opened' : 'sealed'
  );
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (reducedMotion) {
      setStage('opened');
    } else {
      setStage('sealed');
    }
  }, [message.id, reducedMotion]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const triggerRomanticConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#e91e63', '#ff4d6d', '#f472b6', '#fbcfe8', '#ffffff'],
        shapes: ['circle']
      });
    } catch {
      // ignore
    }
  };

  const handleOpenClick = () => {
    if (reducedMotion) {
      setStage('opened');
      return;
    }
    setStage('opening');
    triggerRomanticConfetti();
    setTimeout(() => {
      setStage('opened');
    }, 850);
  };

  const handleReplay = () => {
    setStage('sealed');
  };

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(message, replyText.trim());
    setReplyText('');
  };

  const t = (TRANSLATIONS as any)[lang] || TRANSLATIONS.en;
  const isSender = currentMember?.username === coupleSpace?.members?.[message.senderRole]?.username;
  const recipientRole = message.senderRole === 'partnerA' ? 'partnerB' : 'partnerA';
  const recipientProfile = coupleSpace?.members?.[recipientRole] || null;
  const senderProfile = coupleSpace?.members?.[message.senderRole] || null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-5"
    >
      {/* 1. Permanent Fixed Corner Close Button - Always visible on mobile & desktop */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-3 right-3 sm:top-5 sm:right-5 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white border-2 border-white/60 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Close"
        title={lang === 'ar' ? 'إغلاق الرسالة (Esc)' : 'Close letter (Esc)'}
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Background Floating Hearts */}
      {!reducedMotion && stage === 'opened' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {['💖', '✨', '🌸', '💌', '💕', '⭐'].map((item, i) => (
            <div
              key={i}
              className="absolute animate-pulse text-xl sm:text-2xl opacity-40 select-none"
              style={{
                left: `${10 + i * 16}%`,
                top: `${12 + (i % 3) * 28}%`,
                animationDuration: `${2.2 + i * 0.4}s`
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      <div className="min-h-full flex items-start justify-center py-2 sm:py-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-2xl my-auto"
        >
          {/* Top Sticky Toolbar */}
          <div className="sticky top-0 z-40 mb-3 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              {stage === 'opened' && !reducedMotion && (
                <button
                  type="button"
                  onClick={handleReplay}
                  className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{t.replayAnimation}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs font-medium flex items-center gap-1.5 transition"
                title="Print letter keepsake"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavorite(message)}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition"
                aria-label="Toggle favorite"
              >
                <Star
                  className={`w-4 h-4 ${
                    message.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-white'
                  }`}
                />
              </button>

              {isSender && (
                <>
                  <button
                    type="button"
                    onClick={() => onEditMessage(message)}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition"
                    title="Edit letter"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الرسالة؟' : 'Are you sure you want to delete this love note?')) {
                        onDeleteMessage(message.id);
                      }
                    }}
                    className="p-2 rounded-full bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1.5 font-bold text-xs shadow-md"
                aria-label="Close modal"
                title={lang === 'ar' ? 'إغلاق الرسالة' : 'Close modal'}
              >
                <X className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إغلاق' : 'Close'}</span>
              </button>
            </div>
          </div>

        {/* STAGE 1: Sealed Interactive Wax Envelope */}
        {stage !== 'opened' && (
          <div
            onClick={handleOpenClick}
            className={`cursor-pointer rounded-3xl p-6 sm:p-10 shadow-2xl border-2 text-center transition-all duration-700 select-none ${
              stage === 'opening'
                ? 'scale-105 opacity-80 rotate-1'
                : 'hover:scale-[1.02] bg-gradient-to-br from-rose-50 via-pink-100 to-rose-200 border-rose-300 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900 dark:border-rose-900/60'
            }`}
          >
            <div className="py-6 sm:py-10 flex flex-col items-center">
              {/* Wax Seal Icon with wobble */}
              <div className="relative mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-pink-500 shadow-xl border-4 border-amber-300/80 flex items-center justify-center text-3xl sm:text-4xl hover-wax overflow-hidden">
                  {senderProfile?.avatarUrl ? (
                    <img
                      src={senderProfile.avatarUrl}
                      alt={senderProfile.displayName || 'Sender'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    message.design?.sticker || senderProfile?.avatarEmoji || '💌'
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-bold uppercase tracking-wider shadow">
                  WAX SEAL
                </div>
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-300">
                A Sealed Love Letter
              </span>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-2 text-rose-950 dark:text-rose-100">
                {message.title || 'For My Favorite Heart'}
              </h2>

              <p className="text-xs sm:text-sm text-rose-800/80 dark:text-rose-300/80 mt-1 max-w-sm">
                From {senderProfile?.displayName || 'Your Partner'} with pure love
              </p>

              <div className="mt-8 px-6 py-3 rounded-full bg-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-500/30 flex items-center gap-2 hover:bg-rose-500 transition">
                <MailOpen className="w-4 h-4" />
                <span>{t.openEnvelope}</span>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: Opened Letter & Full Card View */}
        {stage === 'opened' && (
          <div className="space-y-4 animate-fadeIn">
            <StyledMessageCard
              message={message}
              design={message.design}
              senderProfile={senderProfile}
              recipientProfile={recipientProfile}
              onToggleFavorite={onToggleFavorite}
              isPreview={true}
              reducedMotion={reducedMotion}
              lang={lang}
            />

            {/* Reactions Picker */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-slate-800 shadow-lg flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-semibold opacity-75">React:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {REACTION_EMOJIS.map((em) => {
                  const hasReacted = message.reactions?.includes(em);
                  return (
                    <button
                      key={em}
                      type="button"
                      onClick={() => onAddReaction(message, em)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-lg sm:text-xl flex items-center justify-center transition ${
                        hasReacted
                          ? 'bg-rose-500/20 border border-rose-500 scale-110 shadow-sm'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 active:scale-95'
                      }`}
                      aria-label={`React with ${em}`}
                    >
                      {em}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Private Replies Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-slate-800 shadow-lg space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                Our Private Replies
              </h4>

              {message.replies && message.replies.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {message.replies.map((reply, i) => {
                    const replyAuthor = coupleSpace?.members?.[reply.authorRole];
                    return (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-slate-800/60 text-xs border border-rose-100 dark:border-slate-700/60 flex items-start gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-rose-500/20 flex items-center justify-center text-xs font-bold shrink-0 border border-rose-300/40">
                          {replyAuthor?.avatarUrl ? (
                            <img
                              src={replyAuthor.avatarUrl}
                              alt={replyAuthor.displayName || 'Author'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{replyAuthor?.avatarEmoji || '💌'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between font-bold text-rose-900 dark:text-rose-200 mb-0.5">
                            <span className="truncate">{reply.authorName}</span>
                            <span className="text-[10px] opacity-60 font-mono shrink-0">
                              {new Date(reply.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="opacity-90 break-words">{reply.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs opacity-60 italic">No replies yet. Whisper back below...</p>
              )}

              {/* Reply Form */}
              <form onSubmit={submitReply} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t.privateReply}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-1 shadow-md transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Bottom Actions: Close Letter & Back to Feed */}
            <div className="pt-2 pb-6 flex items-center justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white font-semibold text-xs sm:text-sm border border-white/30 backdrop-blur-md shadow-xl flex items-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إغلاق الرسالة والعودة' : t.closeLetter}</span>
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
