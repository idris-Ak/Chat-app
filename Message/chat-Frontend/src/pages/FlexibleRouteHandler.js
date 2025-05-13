import { useLocation } from 'react-router-dom';

export default function FlexibleRouteHandler() {
  const location = useLocation();

  // Path segments like ["store", "sydney", "shoes"]
  const segments = location.pathname.split('/').filter(Boolean);

  // Query parameters like { sort: "price", limit: "10" }
  const queryParams = Object.fromEntries(new URLSearchParams(location.search));

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dynamic URL Info</h2>

      <h4>🔗 Path Segments</h4>
      <ul>
        {segments.map((seg, idx) => (
          <li key={idx}>
            Segment {idx + 1}: <strong>{seg}</strong>
          </li>
        ))}
      </ul>

      <h4>🔎 Query Parameters</h4>
      {Object.keys(queryParams).length > 0 ? (
        <ul>
          {Object.entries(queryParams).map(([key, value]) => (
            <li key={key}>
              {key}: <strong>{value}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>None</p>
      )}
    </div>
  );
}
