import { Route, Routes } from 'react-router-dom';
import DiscoveryProfileScreen from '@/components/discovery/DiscoveryProfileScreen';
import DiscoveryRadioScreen from '@/components/discovery/DiscoveryRadioScreen';
import DiscoveryYesNoScreen from '@/components/discovery/DiscoveryYesNoScreen';
import DiscoveryFormScreen from '@/components/discovery/DiscoveryFormScreen';
import ConnectionSuccess from '@/pages/discovery/ConnectionSuccess';
import Recommend from '@/pages/discovery/Recommend';
import ReligionInfo from '@/pages/discovery/ReligionInfo';
import {
  DAUGHTER_PROFILE,
  FAMILY_PROFILE,
  MOTHER_PROFILE,
} from '@/lib/discoveryProfiles';
import {
  FAMILY_QUESTION_FIELDS,
  LIFESTYLE_QUESTIONS,
  PERSONAL_QUESTION_FIELDS,
  SEEKING_CHILD_REASONS,
  SEEKING_PARENT_REASONS,
  SEEKING_SIBLING_REASONS,
} from '@/lib/discoveryContent';
import { withPreviewQuery } from '@/lib/screenCatalog';

export default function Discovery() {
  return (
    <Routes>
      <Route
        path="daughter-profile"
        element={<DiscoveryProfileScreen profile={DAUGHTER_PROFILE} />}
      />
      <Route
        path="mother-profile"
        element={<DiscoveryProfileScreen profile={MOTHER_PROFILE} />}
      />
      <Route
        path="family-profile"
        element={<DiscoveryProfileScreen profile={FAMILY_PROFILE} />}
      />
      <Route path="connection-success" element={<ConnectionSuccess />} />
      <Route
        path="seeking-parent-reasons"
        element={(
          <DiscoveryRadioScreen
            title="Why are you seeking a parent?"
            subtitle="Choose the one that resonates most"
            options={SEEKING_PARENT_REASONS}
            backTo={withPreviewQuery('/screens')}
            continueTo={withPreviewQuery('/Discovery/lifestyle-questions')}
            initialValue="guidance_support"
          />
        )}
      />
      <Route
        path="seeking-child-reasons"
        element={(
          <DiscoveryRadioScreen
            title="Why are you seeking a child?"
            subtitle="Choose the one that resonates most"
            options={SEEKING_CHILD_REASONS}
            backTo={withPreviewQuery('/screens')}
            continueTo={withPreviewQuery('/Discovery/lifestyle-questions')}
            initialValue="positive_presence"
          />
        )}
      />
      <Route
        path="seeking-sibling-reasons"
        element={(
          <DiscoveryRadioScreen
            title="Why are you seeking a sibling?"
            subtitle="Choose the one that resonates most"
            options={SEEKING_SIBLING_REASONS}
            backTo={withPreviewQuery('/screens')}
            continueTo={withPreviewQuery('/Discovery/lifestyle-questions')}
            initialValue="share_experiences"
          />
        )}
      />
      <Route
        path="lifestyle-questions"
        element={(
          <DiscoveryYesNoScreen
            title="Lifestyle"
            subtitle="A few quick questions to help families connect"
            questions={LIFESTYLE_QUESTIONS}
            backTo={withPreviewQuery('/Discovery/seeking-parent-reasons')}
            continueTo={withPreviewQuery('/Discovery/personal-questions')}
            initialValues={{
              real_life_visits: false,
              can_host_visitors: true,
              has_biological_kids: false,
              enjoy_feeding_youth: false,
            }}
          />
        )}
      />
      <Route
        path="personal-questions"
        element={(
          <DiscoveryFormScreen
            title="About you"
            subtitle="These answers help families connect with the real you."
            fields={PERSONAL_QUESTION_FIELDS}
            backTo={withPreviewQuery('/Discovery/lifestyle-questions')}
            continueTo={withPreviewQuery('/Discovery/family-questions')}
          />
        )}
      />
      <Route
        path="family-questions"
        element={(
          <DiscoveryFormScreen
            title="Family profile"
            subtitle="Tell others what it's like to be part of your family."
            fields={FAMILY_QUESTION_FIELDS}
            backTo={withPreviewQuery('/Discovery/personal-questions')}
            continueTo={withPreviewQuery('/Discovery/religion-info')}
          />
        )}
      />
      <Route path="religion-info" element={<ReligionInfo />} />
      <Route path="recommend" element={<Recommend />} />
    </Routes>
  );
}
