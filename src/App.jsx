// App.jsx
// Minimal shell: global styles + routes. The Landing page is a temporary placeholder (Phase 3).
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './styles/Fonts.css';
import './styles/Tokens.css';
import './styles/Global.css';
import Play from './pages/Play';

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>TypeTayo</h1>
      <ul>
        <li><Link to="/play/easy">Easy</Link></li>
        <li><Link to="/play/medium">Medium</Link></li>
        <li><Link to="/play/hard">Hard</Link></li>
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:level" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}