import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CoupleSpace, Message, Template, Memory } from '../types';

// Read configuration from environment variables or localStorage
function getSupabaseCredentials() {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || metaEnv.NEXT_PUBLIC_SUPABASE_URL || metaEnv.SUPABASE_URL || '';
  const envKey =
    metaEnv.VITE_SUPABASE_ANON_KEY ||
    metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
    metaEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    metaEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    metaEnv.SUPABASE_ANON_KEY ||
    '';

  const localSaved = localStorage.getItem('happy_messages_supabase_config');
  if (localSaved) {
    try {
      const parsed = JSON.parse(localSaved);
      if (parsed.url && parsed.key) {
        return { url: parsed.url.trim(), key: parsed.key.trim(), source: 'localStorage' };
      }
    } catch (e) {
      // ignore
    }
  }

  return {
    url: envUrl.trim(),
    key: envKey.trim(),
    source: envUrl && envKey ? 'env' : 'none'
  };
}

let supabaseInstance: SupabaseClient | null = null;
const creds = getSupabaseCredentials();

if (creds.url && creds.key && creds.url.startsWith('http')) {
  try {
    supabaseInstance = createClient(creds.url, creds.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize Supabase client:', err);
  }
}

export const supabase = supabaseInstance;

export function isSupabaseConnected(): boolean {
  return supabaseInstance !== null;
}

export function saveSupabaseCustomConfig(url: string, key: string): boolean {
  if (!url || !key) {
    localStorage.removeItem('happy_messages_supabase_config');
    window.location.reload();
    return true;
  }
  try {
    localStorage.setItem('happy_messages_supabase_config', JSON.stringify({ url: url.trim(), key: key.trim() }));
    window.location.reload();
    return true;
  } catch (e) {
    return false;
  }
}

export function getActiveSupabaseInfo() {
  const c = getSupabaseCredentials();
  return {
    configured: isSupabaseConnected(),
    url: c.url,
    source: c.source,
  };
}

// ============================================================================
// DATA STORAGE API (Hybrid: Supabase PostgreSQL with local cache / fallback)
// ============================================================================

const LOCAL_STORAGE_KEYS = {
  spaces: 'happy_couple_spaces_v1',
  messages: 'happy_couple_messages_v1',
  templates: 'happy_couple_templates_v1',
  memories: 'happy_couple_memories_v1',
};

function getLocalData<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage quota or write error:', e);
  }
}

// ---------------------------
// 1. COUPLE SPACES
// ---------------------------
export async function dbFetchAllSpaces(): Promise<CoupleSpace[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('couple_spaces')
        .select('*');
      if (!error && data) {
        // Map postgres snake_case to typescript camelCase
        const mapped: CoupleSpace[] = data.map(row => ({
          id: row.id,
          pairingCode: row.pairing_code,
          coupleName: row.couple_name,
          websiteTitle: row.website_title,
          activeThemeId: row.active_theme_id,
          customTheme: row.custom_theme,
          members: row.members,
          createdAt: row.created_at,
        }));
        setLocalData(LOCAL_STORAGE_KEYS.spaces, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch spaces error, using cache:', e);
    }
  }
  return getLocalData<CoupleSpace>(LOCAL_STORAGE_KEYS.spaces);
}

export async function dbSaveCoupleSpace(space: CoupleSpace): Promise<void> {
  // Always update local cache
  const localList = getLocalData<CoupleSpace>(LOCAL_STORAGE_KEYS.spaces);
  const idx = localList.findIndex(s => s.id === space.id);
  if (idx >= 0) localList[idx] = space;
  else localList.push(space);
  setLocalData(LOCAL_STORAGE_KEYS.spaces, localList);

  if (supabase) {
    const row = {
      id: space.id,
      pairing_code: space.pairingCode,
      couple_name: space.coupleName,
      website_title: space.websiteTitle,
      active_theme_id: space.activeThemeId,
      custom_theme: space.customTheme || {},
      members: space.members,
      created_at: space.createdAt,
    };
    const { error } = await supabase.from('couple_spaces').upsert(row);
    if (error) console.error('Supabase save space error:', error);
  }
}

// ---------------------------
// 2. COUPLE MESSAGES
// ---------------------------
export async function dbFetchMessages(coupleId: string): Promise<Message[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('couple_messages')
        .select('*')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped: Message[] = data.map(row => ({
          id: row.id,
          coupleId: row.couple_id,
          senderRole: row.sender_role,
          senderName: row.sender_name,
          title: row.title,
          body: row.body,
          mood: row.mood,
          photoData: row.photo_data || '',
          voiceData: row.voice_data || '',
          scheduledDate: row.scheduled_date,
          isDraft: row.is_draft,
          isFavorite: row.is_favorite,
          isRead: row.is_read,
          design: row.design,
          reactions: row.reactions || [],
          replies: row.replies || [],
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
        // Update local cache for this couple
        const localAll = getLocalData<Message>(LOCAL_STORAGE_KEYS.messages);
        const filtered = localAll.filter(m => m.coupleId !== coupleId);
        setLocalData(LOCAL_STORAGE_KEYS.messages, [...filtered, ...mapped]);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch messages error, using cache:', e);
    }
  }

  const all = getLocalData<Message>(LOCAL_STORAGE_KEYS.messages);
  return all.filter(m => m.coupleId === coupleId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function dbSaveMessage(msg: Message): Promise<void> {
  const localList = getLocalData<Message>(LOCAL_STORAGE_KEYS.messages);
  const idx = localList.findIndex(m => m.id === msg.id);
  if (idx >= 0) localList[idx] = msg;
  else localList.push(msg);
  setLocalData(LOCAL_STORAGE_KEYS.messages, localList);

  if (supabase) {
    const row = {
      id: msg.id,
      couple_id: msg.coupleId,
      sender_role: msg.senderRole,
      sender_name: msg.senderName,
      title: msg.title,
      body: msg.body,
      mood: msg.mood,
      photo_data: msg.photoData || '',
      voice_data: msg.voiceData || '',
      scheduled_date: msg.scheduledDate,
      is_draft: msg.isDraft,
      is_favorite: msg.isFavorite,
      is_read: msg.isRead,
      design: msg.design,
      reactions: msg.reactions || [],
      replies: msg.replies || [],
      created_at: msg.createdAt,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('couple_messages').upsert(row);
    if (error) console.error('Supabase save message error:', error);
  }
}

export async function dbDeleteMessage(msgId: string): Promise<void> {
  const localList = getLocalData<Message>(LOCAL_STORAGE_KEYS.messages);
  setLocalData(LOCAL_STORAGE_KEYS.messages, localList.filter(m => m.id !== msgId));

  if (supabase) {
    const { error } = await supabase.from('couple_messages').delete().eq('id', msgId);
    if (error) console.error('Supabase delete message error:', error);
  }
}

// ---------------------------
// 3. TEMPLATES
// ---------------------------
export async function dbFetchTemplates(coupleId: string): Promise<Template[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('couple_templates')
        .select('*')
        .eq('couple_id', coupleId);
      if (!error && data) {
        const mapped: Template[] = data.map(r => ({
          id: r.id,
          coupleId: r.couple_id,
          name: r.name,
          design: r.design,
          createdAt: r.created_at,
        }));
        const localAll = getLocalData<Template>(LOCAL_STORAGE_KEYS.templates);
        const filtered = localAll.filter(t => t.coupleId !== coupleId);
        setLocalData(LOCAL_STORAGE_KEYS.templates, [...filtered, ...mapped]);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch templates error:', e);
    }
  }
  return getLocalData<Template>(LOCAL_STORAGE_KEYS.templates).filter(t => t.coupleId === coupleId);
}

export async function dbSaveTemplate(template: Template): Promise<void> {
  const localList = getLocalData<Template>(LOCAL_STORAGE_KEYS.templates);
  const idx = localList.findIndex(t => t.id === template.id);
  if (idx >= 0) localList[idx] = template;
  else localList.push(template);
  setLocalData(LOCAL_STORAGE_KEYS.templates, localList);

  if (supabase) {
    const row = {
      id: template.id,
      couple_id: template.coupleId,
      name: template.name,
      design: template.design,
      created_at: template.createdAt,
    };
    const { error } = await supabase.from('couple_templates').upsert(row);
    if (error) console.error('Supabase save template error:', error);
  }
}

export async function dbDeleteTemplate(id: string): Promise<void> {
  const localList = getLocalData<Template>(LOCAL_STORAGE_KEYS.templates);
  setLocalData(LOCAL_STORAGE_KEYS.templates, localList.filter(t => t.id !== id));

  if (supabase) {
    const { error } = await supabase.from('couple_templates').delete().eq('id', id);
    if (error) console.error('Supabase delete template error:', error);
  }
}

// ---------------------------
// 4. MEMORIES
// ---------------------------
export async function dbFetchMemories(coupleId: string): Promise<Memory[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('couple_memories')
        .select('*')
        .eq('couple_id', coupleId)
        .order('date', { ascending: false });
      if (!error && data) {
        const mapped: Memory[] = data.map(r => ({
          id: r.id,
          coupleId: r.couple_id,
          title: r.title,
          caption: r.caption,
          category: r.category,
          date: r.date,
          photoData: r.photo_data || '',
          createdBy: r.created_by,
          createdAt: r.created_at,
        }));
        const localAll = getLocalData<Memory>(LOCAL_STORAGE_KEYS.memories);
        const filtered = localAll.filter(m => m.coupleId !== coupleId);
        setLocalData(LOCAL_STORAGE_KEYS.memories, [...filtered, ...mapped]);
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase fetch memories error:', e);
    }
  }
  return getLocalData<Memory>(LOCAL_STORAGE_KEYS.memories).filter(m => m.coupleId === coupleId);
}

export async function dbSaveMemory(mem: Memory): Promise<void> {
  const localList = getLocalData<Memory>(LOCAL_STORAGE_KEYS.memories);
  const idx = localList.findIndex(m => m.id === mem.id);
  if (idx >= 0) localList[idx] = mem;
  else localList.push(mem);
  setLocalData(LOCAL_STORAGE_KEYS.memories, localList);

  if (supabase) {
    const row = {
      id: mem.id,
      couple_id: mem.coupleId,
      title: mem.title,
      caption: mem.caption,
      category: mem.category,
      date: mem.date,
      photo_data: mem.photoData || '',
      created_by: mem.createdBy,
      created_at: mem.createdAt,
    };
    const { error } = await supabase.from('couple_memories').upsert(row);
    if (error) console.error('Supabase save memory error:', error);
  }
}

export async function dbDeleteMemory(id: string): Promise<void> {
  const localList = getLocalData<Memory>(LOCAL_STORAGE_KEYS.memories);
  setLocalData(LOCAL_STORAGE_KEYS.memories, localList.filter(m => m.id !== id));

  if (supabase) {
    const { error } = await supabase.from('couple_memories').delete().eq('id', id);
    if (error) console.error('Supabase delete memory error:', error);
  }
}

// ---------------------------
// 5. REAL-TIME SUBSCRIPTION
// ---------------------------
export function subscribeToCoupleRealtime(
  coupleId: string,
  onUpdate: () => void
): () => void {
  if (!supabase || !coupleId) {
    return () => {};
  }

  const channel = supabase
    .channel(`couple-live-${coupleId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'couple_messages',
        filter: `couple_id=eq.${coupleId}`,
      },
      () => {
        onUpdate();
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'couple_spaces',
        filter: `id=eq.${coupleId}`,
      },
      () => {
        onUpdate();
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'couple_memories',
        filter: `couple_id=eq.${coupleId}`,
      },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}
