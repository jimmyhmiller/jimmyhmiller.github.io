import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggle = () => {
    const cur = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (_) {}
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Toggle light mode"
      title="Toggle theme"
      onClick={toggle}
      suppressHydrationWarning
    >
      <svg className="moon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5z"/>
      </svg>
      <svg className="sun" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="8" cy="8" r="3"/>
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"/>
      </svg>
    </button>
  );
}
