// pages/Landing.jsx
import Hero from '../components/landing/Hero';
import LevelCards from '../components/landing/LevelCards';
import HowItWorks from '../components/landing/HowItWorks';
import LeaderboardPreview from '../components/landing/LeaderboardPreview';

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