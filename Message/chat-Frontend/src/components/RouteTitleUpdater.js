import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const formatTitle = (segments) => {
  if (segments.length === 0) return 'chat-app';

  const capitalized = segments.map(s =>
    s.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
  );

  return `${capitalized.join(' › ')} | chat-app`;
};

const RouteTitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname
      .split('/')
      .filter(Boolean); // Remove empty strings

    const title = formatTitle(pathSegments);
    document.title = title;
  }, [location]);

  return null; // No UI
};

export default RouteTitleUpdater;
