import { useLocation } from 'react-router-dom';

const GlowButton = ({ onClick }) => {
  const location = useLocation();
  const showOnPaths = ['/', '/local-events'];
  const shouldShow = showOnPaths.includes(location.pathname);

  if (!shouldShow) return null;

  return (
    <button 
      className="glow-button"
      onClick={onClick}
      aria-label="Quick action"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L14.39 8.25L20 9.27L16 13.14L16.94 18.73L12 16.09L7.06 18.73L8 13.14L4 9.27L9.61 8.25L12 3Z" />
      </svg>
    </button>
  );
};

export default GlowButton; 