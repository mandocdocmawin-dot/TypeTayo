import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Leaderboard from './pages/Leaderboard';
import Static from './pages/Static';
import Play from './pages/Play';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/about" element={<Static page="about" />} />
        <Route path="/privacy" element={<Static page="privacy" />} />
        <Route path="/contact" element={<Static page="contact" />} />
      </Route>

      <Route path="/play/:level" element={<Play />} />
    </Routes>
  );
}