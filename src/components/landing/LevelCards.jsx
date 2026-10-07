// components/landing/LevelCards.jsx
// TODO (Phase 4): read the personal best per level through the api adapter and pass it as `best`.
import SectionTitle from '../common/SectionTitle';
import LevelCard from './LevelCard';
import styles from './LevelCards.module.css';

const CARDS = [
  { level: 'easy', title: 'Easy', tag: 'Great for beginners', description: 'Short words, home row keys', preview: 'sadfall', previewIndex: 3 },
  { level: 'medium', title: 'Medium', tag: 'Most popular', description: 'Longer words, all letters', preview: 'keyboard', previewIndex: 3 },
  { level: 'hard', title: 'Hard', tag: 'For speed demons', description: 'Capitals, numbers and symbols', preview: 'Hello#2026', previewIndex: 5 },
];

export default function LevelCards() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="levels-title">
      <SectionTitle id="levels-title">Choose Your Level</SectionTitle>
      <div className={styles.grid}>
        {CARDS.map((c) => (
          <LevelCard key={c.level} {...c} />
        ))}
      </div>
    </section>
  );
}