import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';


export default function LandingPage() {
  const location = useLocation();
  const [fullPath, setFullPath] = useState('');
  const [lastPart, setLastPart] = useState('');

  useEffect(() => {
    const path = location.pathname;
    const last = path.split('/').filter(Boolean).pop();

    setFullPath(path);
    setLastPart(last);
  }, [location.pathname]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <Navigation />
      </header>

      <main className="landing-main">



        {/* ✅ This is now React-managed */}
        <div id="fullPathDisplay">Full Path: {fullPath}</div>
        <div id="lastPartDisplay">Last Part: {lastPart}</div>
      </main>

    </div>
  );
}
