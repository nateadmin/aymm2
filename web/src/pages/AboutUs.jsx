import { Link } from 'react-router-dom';
import HeartLogo from '@/components/brand/HeartLogo';
import PageShell from '@/components/PageShell';
import BackButton from '@/components/mobile/BackButton';

export default function AboutUs() {
  return (
    <main className="public-page">
      <PageShell
        eyebrow="About"
        title="About AYMM"
        description="Are You My Mother connects people seeking family, guidance, and belonging."
      >
        <BackButton />
        <div className="about-page">
          <HeartLogo className="about-page__logo" />
          <div className="about-page__copy">
            <p>
              <strong>Are You My Mother (AYMM)</strong> is a platform that connects people seeking
              meaningful parental relationships, children, and sibling-style family connections.
            </p>
            <p>
              We believe that family is not just about blood. It is about love, connection,
              and being there for each other. Whether you are a child seeking a parent figure,
              a parent looking to share your love and wisdom, or a family wanting to welcome
              new siblings, AYMM brings people together.
            </p>
            <p>Our three core relationship types are:</p>
            <ul>
              <li>Children seeking parents</li>
              <li>Parents seeking children</li>
              <li>Families seeking sibling-style members</li>
            </ul>
            <p>
              Through Family Tables, we also help families host real-world events and gatherings,
              bringing digital connections into real life.
            </p>
            <p className="about-page__tagline">Welcome home.</p>
          </div>
          <Link className="aymm-button aymm-button--outline" to="/Welcome">Back to welcome</Link>
        </div>
      </PageShell>
    </main>
  );
}
