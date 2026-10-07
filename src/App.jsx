// pages/Landing.jsx
import Hero from '../src/components/landing/Hero';
import LevelCards from '../src/components/landing/LevelCards';
import HowItWorks from '../src/components/landing/HowItWorks';
import LeaderboardPreview from '../src/components/landing/LeaderboardPreview';

export default function Landing() {
  return (
    <>
      <Hero />
      <LevelCards />
      <HowItWorks />
      <LeaderboardPreview />
    </>
  );
}