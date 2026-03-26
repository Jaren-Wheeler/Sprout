import { useState } from 'react';
import '../styles/navigation.css';
import Header from './Header';
import SideMenu from './SideMenu';

export default function AppLayout({
  title,
  children,
  shellClassName = '',
  contentClassName = '',
  plainShell = false,
  headerClassName = '',
  headerButtonClassName = '',
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const shellBaseClass = plainShell
    ? 'relative min-h-screen'
    : 'sprout-page-shell';

  return (
    <div
      className={`${shellBaseClass} ${shellClassName} flex flex-col min-h-screen`.trim()}
    >
      <Header
        title={title}
        onMenuClick={() => setMenuOpen((prev) => !prev)}
        className={headerClassName}
        buttonClassName={headerButtonClassName}
      />

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        className={`sprout-page-content flex-1 min-h-0 ${contentClassName}`.trim()}
      >
        {children}
      </main>
    </div>
  );
}
