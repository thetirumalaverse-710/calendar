import { supabase } from './supabaseClient';

const STORAGE_KEY = 'harathi_map_coords_v1';

export async function fetchHarathiCoords(defaultCoords) {
  // 1. First check localStorage for cached custom coords
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length === 17) {
        // Try background fetch from Supabase to keep updated
        syncWithSupabase().catch(() => {});
        return parsed;
      }
    }
  } catch (e) {
    console.warn('localStorage read error:', e);
  }

  // 2. Fetch from Supabase
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'harathi_map_coords')
      .single();

    if (!error && data && data.value) {
      const remoteCoords = data.value;
      if (Array.isArray(remoteCoords) && remoteCoords.length === 17) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteCoords));
        return remoteCoords;
      }
    }
  } catch (err) {
    console.warn('Supabase fetch coords error:', err);
  }

  return defaultCoords;
}

export async function saveHarathiCoordsCloud(newCoords) {
  if (!Array.isArray(newCoords) || newCoords.length !== 17) return false;

  // 1. Save to local storage immediately
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCoords));
  } catch (e) {
    console.warn('localStorage write error:', e);
  }

  // 2. Persist to Supabase so all visitors on the internet load these coordinates
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'harathi_map_coords', value: newCoords }, { onConflict: 'key' });

    if (error) {
      console.warn('Supabase upsert error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save coords error:', err);
    return false;
  }
}

async function syncWithSupabase() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'harathi_map_coords')
    .single();

  if (!error && data && data.value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value));
  }
}
