import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export function Layout() {
  const { theme, toggle } = useTheme();

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink to="/" className="brand">
          <span className="brand-mark" aria-hidden />
          <span className="brand-text">DemWatch</span>
        </NavLink>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>
            Map
          </NavLink>
          <NavLink to="/senate">Senate</NavLink>
          <NavLink to="/house">House</NavLink>
          <NavLink to="/governors">Governors</NavLink>
        </nav>
        <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle color theme">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>DemWatch</p>
      </footer>
    </div>
  );
}
