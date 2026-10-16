import React, { useState } from 'react';
import {
  Heart, MailOpen, Star, MessageCircle, Sparkles
} from 'lucide-react';
import { Message, Design, Member } from '../types';
import { DEFAULT_DESIGN, formatCustomDate } from '../constants';
import { AudioVoicePlayer } from './AudioVoicePlayer';

interface StyledMessageCardProps {
  message: Partial<Message>;
  design?: Design;
  senderProfile?: Member | null;
  recipientProfile?: Member | null;
  onOpenDetail?: (msg: any) => void;
  onToggleFavorite?: (msg: any) => void;
  isPreview?: boolean;
  reducedMotion?: boolean;
  lang?: string;
}

export const StyledMessageCard: React.FC<StyledMessageCardProps> = ({
  message,
  design = DEFAULT_DESIGN,
  senderProfile,
  recipientProfile,
  onOpenDetail,
  onToggleFavorite,
  isPreview = false,
  reducedMotion = false,
  lang = 'en'
}) => {
  const [giftUnwrapped, setGiftUnwrapped] = useState(false);
  const [envelopeQuickOpen, setEnvelopeQuickOpen] = useState(false);

  const d: Design = { ...DEFAULT_DESIGN, ...(design || {}) };
  const layout = d.layout || 'romantic-letter';

  const shadowMap: Record<string, string> = {
    none: 'none',
    soft: '0 10px 30px -5px rgba(233, 30, 99, 0.12), 0 4px 12px rgba(0,0,0,0.05)',
    deep: '0 20px 45px -10px rgba(0, 0, 0, 0.25)',
    glow: `0 0 28px ${d.borderColor || '#f48fb1'}66, 0 8px 20px rgba(0,0,0,0.1)`
  };

  const textureStyles: Record<string, React.CSSProperties> = {
    none: {},
    dots: {
      backgroundImage: `radial-gradient(${d.borderColor || '#f48fb1'}44 1.5px, transparent 1.5px)`,
      backgroundSize: '18px 18px'
    },
    lines: {
      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, ${d.borderColor || '#f48fb1'}33 28px)`
    },
    paper: {
      backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.07) 50%, transparent 50%), linear-gradient(rgba(255,255,255,0.07) 50%, transparent 50%)`,
      backgroundSize: '4px 4px'
    }
  };

  const widthClass =
    d.cardWidth === 'compact'
      ? 'max-w-sm'
      : d.cardWidth === 'wide'
      ? 'max-w-2xl'
      : 'max-w-xl';

  // 12. Animated Gift Box wrapper
  if (layout === 'animated-gift' && !giftUnwrapped && !isPreview) {
    return (
      <div
        onClick={() => setGiftUnwrapped(true)}
        className={`${widthClass} w-full mx-auto cursor-pointer group relative overflow-hidden rounded-3xl p-6 sm:p-8 text-center transition-all duration-300 hover:scale-[1.02] shadow-xl border-2`}
        style={{
          background: d.useGradient ? d.bgGradient : d.bgColor,
          borderColor: d.borderColor,
          color: d.textColor
        }}
      >
        <div className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-pink-500/30 border-y border-pink-400/50" />
        <div className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-pink-500/30 border-x border-pink-400/50" />
        <div className="relative z-10 py-6 flex flex-col items-center">
          <div className={`text-5xl sm:text-6xl mb-3 ${!reducedMotion ? 'animate-bounce' : ''}`}>🎁</div>
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-white/80 dark:bg-slate-900/80 text-pink-700 dark:text-pink-300 shadow-sm mb-2">
            Special Gift For {recipientProfile?.nickname || recipientProfile?.displayName || 'You'}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold mt-1" style={{ fontFamily: d.fontFamily }}>
            {message.title || 'A Sweet Surprise'}
          </h3>
          <p className="text-xs opacity-75 mt-2">Tap to unwrap your message ✨</p>
        </div>
      </div>
    );
  }

  // 2. Interactive Folded Envelope card wrapper
  if (layout === 'folded-envelope' && !envelopeQuickOpen && !isPreview) {
    return (
      <div
        onClick={() => (onOpenDetail ? onOpenDetail(message) : setEnvelopeQuickOpen(true))}
        className={`${widthClass} w-full mx-auto cursor-pointer group relative rounded-2xl p-5 sm:p-7 transition-all duration-300 hover:-translate-y-1 shadow-lg border-2 overflow-hidden`}
        style={{
          background: d.useGradient ? d.bgGradient : d.bgColor,
          borderColor: d.borderColor,
          color: d.textColor
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-20 sm:h-24 origin-top transition-transform duration-500 group-hover:scale-y-90 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, ${d.borderColor}44 0%, transparent 100%)`,
            clipPath: 'polygon(0 0, 50% 100%, 100% 0)'
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center pt-5 pb-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md border-2 border-rose-200 mb-3 group-hover:scale-110 transition-transform">
            <span className="text-xl sm:text-2xl">{d.sticker || '💌'}</span>
          </div>
          <p className="text-[11px] uppercase tracking-widest opacity-70 font-medium">
            Personal Letter To
          </p>
          <h4 className="text-lg sm:text-xl font-bold mt-0.5" style={{ fontFamily: d.fontFamily }}>
            {recipientProfile?.nickname || recipientProfile?.displayName || 'My Love'}
          </h4>
          <p className="text-sm font-medium mt-2 opacity-90 line-clamp-1">
            "{message.title}"
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-200">
            <MailOpen className="w-3.5 h-3.5" />
            Click to Break Wax Seal & Read
          </div>
        </div>
      </div>
    );
  }

  // Layout Booleans
  const isPostcard = layout === 'love-postcard';
  const isSticky = layout === 'sticky-note';
  const isDiary = layout === 'diary-page';
  const isPolaroid = layout === 'polaroid-card';
  const isChat = layout === 'chat-bubble';
  const isGlass = layout === 'glassmorphism';
  const isVintage = layout === 'vintage-paper';
  const isFloating = layout === 'floating-heart';

  const cardBaseClasses = `
    ${widthClass} w-full mx-auto relative transition-all duration-300
    ${isSticky ? 'rotate-[-1deg] shadow-md hover:rotate-0' : ''}
    ${isPolaroid ? 'bg-white text-slate-800 shadow-xl p-3 sm:p-5' : ''}
    ${isGlass ? 'backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 shadow-2xl' : ''}
    ${isVintage ? 'border-4 border-amber-800/40 font-serif' : ''}
    ${isFloating && !reducedMotion ? 'animate-float' : ''}
  `;

  return (
    <div
      onClick={() => onOpenDetail && !isPreview && onOpenDetail(message)}
      className={`${cardBaseClasses} ${!isPreview ? 'cursor-pointer hover:shadow-2xl' : ''}`}
      style={{
        borderRadius: isPolaroid ? 8 : `${d.borderRadius || 20}px`,
        borderWidth: isPolaroid ? 0 : `${d.borderWidth || 2}px`,
        borderStyle: d.borderStyle || 'solid',
        borderColor: d.borderColor || '#f48fb1',
        boxShadow: shadowMap[d.shadowIntensity || 'soft'],
        background: isPolaroid ? '#ffffff' : d.useGradient ? d.bgGradient : d.bgColor,
        color: isPolaroid ? '#1e293b' : d.textColor,
        padding: isPolaroid ? undefined : `${d.padding || 24}px`,
        ...textureStyles[d.bgTexture || 'none']
      }}
    >
      {/* Postcard Air-Mail Edges */}
      {isPostcard && (
        <div
          className="absolute inset-x-0 top-0 h-2 pointer-events-none rounded-t-xl"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 15px, #ffffff 15px, #ffffff 25px, #3b82f6 25px, #3b82f6 40px, #ffffff 40px, #ffffff 50px)'
          }}
        />
      )}

      {/* Sticky Note Pin / Tape */}
      {isSticky && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-5 bg-amber-200/80 backdrop-blur-sm -rotate-2 shadow-sm rounded-sm z-10" />
      )}

      {/* Diary Page Vertical Red Margin Line */}
      {isDiary && (
        <div className="absolute top-0 bottom-0 left-7 sm:left-9 w-0.5 bg-red-400/40 pointer-events-none" />
      )}

      {/* Card Header: Metadata & Sender */}
      <div className={`flex items-start justify-between gap-3 mb-3 ${isDiary ? 'pl-6 sm:pl-8' : ''}`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-base shrink-0 overflow-hidden border border-rose-300/30">
            {senderProfile?.avatarUrl ? (
              <img
                src={senderProfile.avatarUrl}
                alt={senderProfile.displayName || 'Sender'}
                className="w-full h-full object-cover"
              />
            ) : (
              senderProfile?.avatarEmoji || d.sticker || '💌'
            )}
          </div>
          <div className="min-w-0">
            <span className="block text-xs sm:text-sm font-bold truncate">
              {senderProfile?.nickname || senderProfile?.displayName || 'My Love'}
            </span>
            <span className="block text-[11px] opacity-70 truncate">
              {formatCustomDate(message.scheduledDate || message.createdAt || '', d.dateFormat || 'full', lang)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {message.mood && (
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-rose-500/10 font-medium">
              {message.mood}
            </span>
          )}

          {!isPreview && onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(message);
              }}
              className="p-1 rounded-full hover:bg-current/10 transition"
              aria-label="Favorite toggle"
            >
              <Star
                className={`w-4 h-4 transition ${
                  message.isFavorite ? 'fill-amber-400 text-amber-400' : 'opacity-40 hover:opacity-100'
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Polaroid Photo Frame Mode */}
      {isPolaroid && message.photoData && (
        <div className="w-full rounded-sm overflow-hidden mb-3 bg-slate-100 dark:bg-slate-900 border border-current/10 flex items-center justify-center p-1">
          <img
            src={message.photoData}
            alt={message.title || 'Attached'}
            className="w-full h-auto max-h-[480px] object-contain mx-auto rounded-sm"
          />
        </div>
      )}

      {/* Card Salutation */}
      {d.headerText && !isChat && (
        <div
          className={`text-sm italic opacity-80 mb-2 font-serif ${isDiary ? 'pl-6 sm:pl-8' : ''}`}
        >
          {d.headerText}
        </div>
      )}

      {/* Message Title */}
      {message.title && (
        <h3
          className={`font-bold mb-2 break-words ${isDiary ? 'pl-6 sm:pl-8' : ''}`}
          style={{
            fontFamily: d.fontFamily,
            fontSize: `${Math.max(18, (d.fontSize || 18) + 2)}px`,
            textAlign: d.textAlign || 'left'
          }}
        >
          {message.title}
        </h3>
      )}

      {/* Message Body */}
      <div
        className={`whitespace-pre-line break-words leading-relaxed ${isDiary ? 'pl-6 sm:pl-8' : ''}`}
        style={{
          fontFamily: d.fontFamily,
          fontSize: `${d.fontSize || 18}px`,
          lineHeight: d.lineHeight || 1.7,
          textAlign: d.textAlign || 'left'
        }}
      >
        {message.body}
      </div>

      {/* Photo Attachment (for Non-Polaroid layouts) - Shows FULL photo */}
      {!isPolaroid && message.photoData && (
        <div
          className={`mt-4 rounded-2xl overflow-hidden shadow-md border border-current/15 bg-black/5 dark:bg-black/30 flex items-center justify-center p-1.5 ${
            isDiary ? 'ml-6 sm:ml-8' : ''
          }`}
        >
          <img
            src={message.photoData}
            alt="Attachment"
            className="w-full h-auto max-h-[500px] object-contain rounded-xl mx-auto block"
            loading="lazy"
          />
        </div>
      )}

      {/* Voice Note Player */}
      {message.voiceData && (
        <div className={`mt-4 ${isDiary ? 'ml-6 sm:ml-8' : ''}`}>
          <AudioVoicePlayer voiceData={message.voiceData} accentColor={d.borderColor} />
        </div>
      )}

      {/* Card Footer Text */}
      {d.footerText && !isChat && (
        <div
          className={`mt-4 text-xs sm:text-sm font-serif italic text-right opacity-85 ${
            isDiary ? 'pl-6 sm:pl-8' : ''
          }`}
        >
          {d.footerText}
        </div>
      )}

      {/* Reactions & Replies Preview Pill */}
      {((message.reactions && message.reactions.length > 0) ||
        (message.replies && message.replies.length > 0)) && (
        <div
          className={`mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs opacity-90 ${
            isDiary ? 'ml-6 sm:ml-8' : ''
          }`}
        >
          <div className="flex flex-wrap gap-1">
            {message.reactions?.map((em, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-800/80 shadow-xs border border-current/10 text-xs"
              >
                {em}
              </span>
            ))}
          </div>

          {message.replies && message.replies.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium opacity-80">
              <MessageCircle className="w-3.5 h-3.5" />
              {message.replies.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
