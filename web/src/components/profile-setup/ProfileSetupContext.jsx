import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { buildProfilePayload } from '@/lib/onboardingPayload';
import {
  isOnboardingEntryPath,
  isProfileEditPath,
  mergeProfileState,
} from '@/lib/session';
import { CHILD_IDENTITIES, PARENT_IDENTITIES } from '@/lib/constants';
import {
  getOnboardingActorEmail,
  isPreviewOnlyOnboarding,
} from '@/lib/onboardingActor';

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
    intro_video_url: profile.intro_video_url || '',
    religion: profile.religion || '',
    identity_type: profile.identity_type || '',
    family_vibe: profile.family_vibe || 'loud_house',
    question_family_meaning: profile.question_family_meaning || '',
    question_stay_in_touch: profile.question_stay_in_touch || '',
    question_hoping_for: profile.question_hoping_for || '',
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

export function ProfileSetupProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, profile: authProfile, hasProfile, setProfileState } = useAuth();
  const { push } = useToast();
  const [form, setForm] = useState(getDefaultForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasDbProfile, setHasDbProfile] = useState(false);
  const actorEmail = getOnboardingActorEmail(user?.email);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!actorEmail) {
        setLoading(false);
        return;
      }

      if (isPreviewOnlyOnboarding(user?.email)) {
        const draft = loadDraft(actorEmail);
        const savedStep = loadSavedStep(actorEmail);
        if (!cancelled) {
          if (draft) {
            setForm({ ...getDefaultForm(), ...draft });
          }
          if (!isProfileEditPath(location.pathname) && savedStep && getStepIndex(savedStep) >= 0) {
            const step = ONBOARDING_STEPS.find((item) => item.id === savedStep);
            if (step) {
              navigate(step.path, { replace: true });
            }
          }
          setLoading(false);
        }
        return;
      }

      try {
        const { profile } = await profileApi.getMine();
        const draft = loadDraft(actorEmail);
        const savedStep = loadSavedStep(actorEmail);

        if (!cancelled) {
          const editing = isProfileEditPath(location.pathname);

          if (profile) {
            setHasDbProfile(true);
            if (profile.setup_complete) {
              localStorage.removeItem(draftStorageKey(actorEmail));
              localStorage.removeItem(stepStorageKey(actorEmail));
              setForm(normalizeProfile(profile));
            } else {
              setForm(normalizeProfile({ ...profile, ...(draft || {}) }));
            }
          } else if (draft) {
            setForm({ ...getDefaultForm(), ...draft });
          }

          if (!profile?.setup_complete && !editing && savedStep && getStepIndex(savedStep) >= 0) {
            const step = ONBOARDING_STEPS.find((item) => item.id === savedStep);
            if (step) {
              navigate(step.path, { replace: true });
            }
          }
        }
      } catch {
        const draft = loadDraft(actorEmail);
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
  }, [actorEmail, user?.email, navigate, location.pathname]);

  useEffect(() => {
    if (loading || !hasProfile) return;
    if (isProfileEditPath(location.pathname)) return;

    if (isOnboardingEntryPath(location.pathname)) {
      navigate('/Home', { replace: true });
    }
  }, [loading, hasProfile, location.pathname, navigate]);

  const updateField = useCallback((key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      persistDraft(actorEmail, next);
      return next;
    });
  }, [actorEmail]);

  const toggleArrayValue = useCallback((key, value) => {
    setForm((current) => {
      const list = current[key] || [];
      const next = {
        ...current,
        [key]: list.includes(value)
          ? list.filter((item) => item !== value)
          : [...list, value],
      };
      persistDraft(actorEmail, next);
      return next;
    });
  }, [actorEmail]);

  const addPhoto = useCallback((url) => {
    setForm((current) => {
      const next = {
        ...current,
        profile_photos: [...(current.profile_photos || []), url],
      };
      persistDraft(actorEmail, next);
      return next;
    });
  }, [actorEmail]);

  const removePhoto = useCallback((index) => {
    setForm((current) => {
      const next = {
        ...current,
        profile_photos: (current.profile_photos || []).filter((_, i) => i !== index),
      };
      persistDraft(actorEmail, next);
      return next;
    });
  }, [actorEmail]);

  const saveDraft = useCallback(async (stepId, { setupComplete = false, includeSetupComplete = false } = {}) => {
    if (!actorEmail) return false;

    persistDraft(actorEmail, form, stepId);

    if (isPreviewOnlyOnboarding(user?.email)) {
      return true;
    }

    const needsDb = hasDbProfile || (form.display_name && form.identity_type);
    if (!needsDb) {
      return true;
    }

    setSaving(true);
    try {
      const { profile } = await profileApi.saveMine(
        buildProfilePayload(form, { setupComplete, includeSetupComplete }),
      );
      setHasDbProfile(true);
      setProfileState((previous) => mergeProfileState(previous ?? authProfile, profile, {
        preserveSetupComplete: !includeSetupComplete,
      }));
      await queryClient.invalidateQueries({ queryKey: ['Profile'] });
      return true;
    } catch {
      push('Could not save your progress. Please try again.', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }, [actorEmail, user?.email, form, hasDbProfile, authProfile, push, queryClient, setProfileState]);

  const completeOnboarding = useCallback(async () => {
    if (!actorEmail) {
      push('Sign in or use preview mode to submit your profile.', 'error');
      return false;
    }

    setSaving(true);
    try {
      if (isPreviewOnlyOnboarding(user?.email)) {
        localStorage.removeItem(draftStorageKey(actorEmail));
        localStorage.removeItem(stepStorageKey(actorEmail));
        push('Profile submitted!', 'success');
        navigate('/ProfileSetup/complete', { replace: true });
        return true;
      }

      const { profile } = await profileApi.saveMine(
        buildProfilePayload(form, { setupComplete: true, includeSetupComplete: true }),
      );
      const completedProfile = { ...profile, setup_complete: true };

      setHasDbProfile(true);
      setProfileState(completedProfile);
      localStorage.removeItem(draftStorageKey(actorEmail));
      localStorage.removeItem(stepStorageKey(actorEmail));
      await queryClient.invalidateQueries({ queryKey: ['Profile'] });

      push('Profile submitted!', 'success');
      navigate('/ProfileSetup/complete', { replace: true });
      return true;
    } catch {
      push('Could not save your profile. Please try again.', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }, [actorEmail, user?.email, form, push, navigate, queryClient, setProfileState]);

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
