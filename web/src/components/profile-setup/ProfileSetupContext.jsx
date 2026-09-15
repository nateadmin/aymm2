import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import {
  ONBOARDING_STEPS,
  draftStorageKey,
  getDefaultForm,
  getStepIndex,
  stepStorageKey,
} from '@/lib/onboarding';
import { CHILD_IDENTITIES, PARENT_IDENTITIES } from '@/lib/constants';

const ProfileSetupContext = createContext(null);

function normalizeProfile(profile) {
  if (!profile) return getDefaultForm();
  const seekingTypes = profile.seeking_types?.length
    ? profile.seeking_types
    : profile.seeking_type
      ? [profile.seeking_type]
      : [];

  return {
    ...getDefaultForm(),
    ...profile,
    age: profile.age != null ? String(profile.age) : '',
    sibling_count: profile.sibling_count != null ? String(profile.sibling_count) : '',
    beds_available: profile.beds_available != null ? String(profile.beds_available) : '',
    seeking_types: seekingTypes,
    seeking_for: profile.seeking_for || [],
    seeking_sibling_reasons: profile.seeking_sibling_reasons || [],
    profile_photos: profile.profile_photos || [],
    religion: profile.religion || '',
    identity_type: profile.identity_type || '',
    family_vibe: profile.family_vibe || 'loud_house',
  };
}

function persistDraft(email, form, stepId) {
  if (!email) return;
  localStorage.setItem(draftStorageKey(email), JSON.stringify(form));
  if (stepId) {
    localStorage.setItem(stepStorageKey(email), stepId);
  }
}

function loadDraft(email) {
  if (!email) return null;
  try {
    const raw = localStorage.getItem(draftStorageKey(email));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadSavedStep(email) {
  if (!email) return null;
  return localStorage.getItem(stepStorageKey(email));
}

function buildPayload(form, { setupComplete = false } = {}) {
  const payload = {
    display_name: form.display_name,
    age: form.age ? Number(form.age) : null,
    zipcode: form.zipcode || null,
    location: form.location || null,
    lat: form.lat,
    lon: form.lon,
    identity_type: form.identity_type,
    seeking_type: form.seeking_types[0] || null,
    seeking_types: form.seeking_types,
    religion: form.religion || null,
    religion_private: form.religion_private,
    profile_photos: form.profile_photos,
    real_life_visits: form.real_life_visits,
    seeking_for: form.seeking_for,
    grow_up_goal: form.grow_up_goal || null,
    working_towards: form.working_towards || null,
    favorite_foods: form.favorite_foods || null,
    hobbies: form.hobbies || null,
    last_book: form.last_book || null,
    last_movie: form.last_movie || null,
    favorite_childhood_memory: form.favorite_childhood_memory || null,
    has_biological_kids: form.has_biological_kids,
    enjoy_feeding_youth: form.enjoy_feeding_youth,
    can_host_visitors: form.can_host_visitors,
    favorite_books: form.favorite_books || null,
    myths_about_my_day: form.myths_about_my_day || null,
    if_you_were_my_kid: form.if_you_were_my_kid || null,
    family_name: form.family_name || null,
    sibling_count: form.sibling_count ? Number(form.sibling_count) : null,
    beds_available: form.beds_available ? Number(form.beds_available) : null,
    favorite_holidays: form.favorite_holidays || null,
    family_vibe: form.family_vibe || null,
    seeking_sibling_reasons: form.seeking_sibling_reasons,
    bio: form.bio || null,
    setup_complete: setupComplete,
  };

  Object.keys(payload).forEach((key) => {
    if (payload[key] === '' || payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
}

export function ProfileSetupProvider({ children }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, refresh, setProfileState } = useAuth();
  const { push } = useToast();
  const [form, setForm] = useState(getDefaultForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasDbProfile, setHasDbProfile] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const { profile } = await profileApi.getMine();
        const draft = loadDraft(user.email);
        const savedStep = loadSavedStep(user.email);

        if (!cancelled) {
          if (profile) {
            setHasDbProfile(true);
            setForm(normalizeProfile({ ...profile, ...(draft || {}) }));
          } else if (draft) {
            setForm({ ...getDefaultForm(), ...draft });
          }

          if (!profile?.setup_complete && savedStep && getStepIndex(savedStep) >= 0) {
            const step = ONBOARDING_STEPS.find((item) => item.id === savedStep);
            if (step) {
              navigate(step.path, { replace: true });
            }
          }
        }
      } catch {
        const draft = loadDraft(user.email);
        if (!cancelled && draft) {
          setForm({ ...getDefaultForm(), ...draft });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.email, navigate]);

  const updateField = useCallback((key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      persistDraft(user?.email, next);
      return next;
    });
  }, [user?.email]);

  const toggleArrayValue = useCallback((key, value) => {
    setForm((current) => {
      const list = current[key] || [];
      const next = {
        ...current,
        [key]: list.includes(value)
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
      persistDraft(user?.email, next);
      return next;
    });
  }, [user?.email]);

  const addPhoto = useCallback((url) => {
    setForm((current) => {
      const next = {
        ...current,
        profile_photos: [...(current.profile_photos || []), url],
      };
      persistDraft(user?.email, next);
      return next;
    });
  }, [user?.email]);

  const removePhoto = useCallback((index) => {
    setForm((current) => {
      const next = {
        ...current,
        profile_photos: (current.profile_photos || []).filter((_, i) => i !== index),
      };
      persistDraft(user?.email, next);
      return next;
    });
  }, [user?.email]);

  const saveDraft = useCallback(async (stepId, { setupComplete = false } = {}) => {
    if (!user?.email) return false;

    persistDraft(user.email, form, stepId);

    const needsDb = hasDbProfile || (form.display_name && form.identity_type);
    if (!needsDb) {
      return true;
    }

    setSaving(true);
    try {
      const { profile } = await profileApi.saveMine(
        buildPayload(form, { setupComplete }),
      );
      setHasDbProfile(true);
      setProfileState(profile);
      await queryClient.invalidateQueries({ queryKey: ['Profile'] });
      return true;
    } catch {
      push('Could not save your progress. Please try again.', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }, [user?.email, form, hasDbProfile, push, queryClient, setProfileState]);

  const completeOnboarding = useCallback(async () => {
    const saved = await saveDraft('review', { setupComplete: true });
    if (!saved) return false;

    await refresh();
    localStorage.removeItem(draftStorageKey(user.email));
    localStorage.removeItem(stepStorageKey(user.email));
    push('Profile complete!', 'success');
    navigate('/Home', { replace: true });
    return true;
  }, [saveDraft, refresh, user?.email, push, navigate]);

  const isChild = CHILD_IDENTITIES.includes(form.identity_type);
  const isParent = PARENT_IDENTITIES.includes(form.identity_type);
  const isFamily = form.identity_type === 'family';

  const value = useMemo(() => ({
    form,
    loading,
    saving,
    hasDbProfile,
    isChild,
    isParent,
    isFamily,
    updateField,
    toggleArrayValue,
    addPhoto,
    removePhoto,
    saveDraft,
    completeOnboarding,
    steps: ONBOARDING_STEPS,
  }), [
    form,
    loading,
    saving,
    hasDbProfile,
    isChild,
    isParent,
    isFamily,
    updateField,
    toggleArrayValue,
    addPhoto,
    removePhoto,
    saveDraft,
    completeOnboarding,
  ]);

  return (
    <ProfileSetupContext.Provider value={value}>
      {children}
    </ProfileSetupContext.Provider>
  );
}

export function useProfileSetup() {
  const context = useContext(ProfileSetupContext);
  if (!context) {
    throw new Error('useProfileSetup must be used within ProfileSetupProvider');
  }
  return context;
}
