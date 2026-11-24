import HeartLogo from '@/components/brand/HeartLogo';

export function timeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Shared frame-42 home shell (greeting header, profiles rail, quick actions).
 * Prototype passes fixture data; live Home passes API-backed items.
 */
export default function HomeHubLayout({
  greeting,
  subtitle = 'Find your family connection',
  profilesTitle = 'Profiles near you',
  profilesRail,
  quickActionsTitle = 'Quick actions',
  quickActions,
}) {
  return (
  <div className="screen-pad prototype-home">
    <header className="prototype-home__header">
      <div className="prototype-home__copy">
        <h1 className="auth-heading auth-heading--brand prototype-home__greeting">{greeting}</h1>
        <p className="auth-subheading prototype-home__subtitle">{subtitle}</p>
      </div>
      <HeartLogo className="prototype-home__logo" alt="" style={{ width: '70px', height: '70px' }} />
    </header>

    <section>
      <h2 className="home-section-title">{profilesTitle}</h2>
      {profilesRail}
    </section>

    <section className="quick-actions">
      <h2 className="home-section-title">{quickActionsTitle}</h2>
      {quickActions}
    </section>
  </div>
  );
}