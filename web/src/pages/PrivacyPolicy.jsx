import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import BackButton from '@/components/mobile/BackButton';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide when creating your profile, including your name, age, location, photos, and relationship preferences.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'Your information is used to match you with potential family connections, display your profile to other users, and facilitate messaging and Family Table events.',
  },
  {
    title: '3. Photo Moderation',
    body: 'All profile photos go through a moderation and approval process to ensure safety and appropriateness.',
  },
  {
    title: '4. Messaging Privacy',
    body: 'Messages between unmatched users are treated as requests. Recipients may choose not to open message requests. Message previews are only visible for accepted connections.',
  },
  {
    title: '5. Blocking and Reporting',
    body: 'Users can block other users and report profiles, posts, and comments. Reports are reviewed by our moderation team.',
  },
  {
    title: '6. Data Protection',
    body: 'We implement security measures to protect your personal information. Religion information can be set to private.',
  },
  {
    title: '7. Disconnecting',
    body: 'Users can disconnect from any connection at any time, removing the relationship and associated messaging privileges.',
  },
  {
    title: '8. Contact',
    body: 'For questions about this policy, use the Report feature in the app or contact our support team.',
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="public-page">
      <PageShell
        eyebrow="Legal"
        title="Privacy policy"
        description="How AYMM collects, uses, and protects your information."
      >
        <BackButton />
        <div className="legal-page">
          {SECTIONS.map((section) => (
            <section key={section.title} className="legal-page__section">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          <Link className="aymm-button aymm-button--outline" to="/Welcome">Back to welcome</Link>
        </div>
      </PageShell>
    </main>
  );
}
