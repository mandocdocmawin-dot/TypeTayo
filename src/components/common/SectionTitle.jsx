// components/common/SectionTitle.jsx
import styles from './SectionTitle.module.css';

export default function SectionTitle({ id, children }) {
  return (
    <h2 id={id} className={styles.title}>
      {children}
    </h2>
  );
}