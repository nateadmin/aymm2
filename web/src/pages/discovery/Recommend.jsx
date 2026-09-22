import { Check, Heart, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileScreen from '@/components/mobile/MobileScreen';
import BackButton from '@/components/mobile/BackButton';
import Button from '@/components/ui/Button';
import { RECOMMEND_CHANNELS } from '@/lib/discoveryContent';
import { RECOMMEND_PROFILE } from '@/lib/discoveryProfiles';
import { labelForIdentity } from '@/lib/constants';
import { withPreviewQuery } from '@/lib/screenCatalog';

const CHANNEL_ICONS = {
  heart: Heart,
  mail: Mail,
  message: MessageCircle,
};

export default function Recommend() {
  const navigate = useNavigate();
  const [channel, setChannel] = useState('aymm');
  const [query, setQuery] = useState('');
  const photo = RECOMMEND_PROFILE.profile_photos[0];
  const canSend = channel !== 'aymm' || query.trim().length > 0;

  return (
    <MobileScreen bodyClassName="mobile-onboarding-scroll">
      <div className="screen-pad screen-pad--handheld mobile-onboarding mobile-onboarding--scroll">
        <div className="mobile-onboarding__content">
          <BackButton to={withPreviewQuery('/Discovery/daughter-profile')} />

          <div>
            <h1 className="auth-heading auth-heading--brand">
              Recommend {RECOMMEND_PROFILE.display_name}
            </h1>
            <p className="auth-subheading">
              Share this profile with someone who might be a great match.
            </p>
          </div>

          <div className="recommend-preview">
            <img src={photo} alt="" className="recommend-preview__photo" />
            <div>
              <p className="recommend-preview__name">
                {RECOMMEND_PROFILE.display_name}, {RECOMMEND_PROFILE.age}
              </p>
              <p className="recommend-preview__meta">
                {labelForIdentity(RECOMMEND_PROFILE.identity_type)} · {RECOMMEND_PROFILE.location}
              </p>
            </div>
          </div>

          <div>
            <p className="recommend-section-label">Send via</p>
            <div className="identity-role-list">
              {RECOMMEND_CHANNELS.map((option) => {
                const selected = channel === option.id;
                const Icon = CHANNEL_ICONS[option.icon];
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`identity-role-option recommend-channel${selected ? ' identity-role-option--selected' : ''}`}
                    onClick={() => setChannel(option.id)}
                  >
                    <span className="recommend-channel__icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                    <span className="identity-role-option__label">{option.label}</span>
                    <span className="identity-role-option__radio" aria-hidden="true">
                      {selected ? <Check size={14} strokeWidth={3} /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {channel === 'aymm' ? (
            <label className="auth-field">
              <span className="auth-field__label">AYMM User</span>
              <input
                className="aymm-input"
                placeholder="Search by name or username"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          ) : null}
        </div>

        <Button
          variant={canSend ? 'primary' : 'disabled'}
          disabled={!canSend}
          onClick={() => navigate(withPreviewQuery('/screens'))}
        >
          Send Recommendation
        </Button>
      </div>
    </MobileScreen>
  );
}
