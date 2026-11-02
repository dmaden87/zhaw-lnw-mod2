'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMountain, IconMessageQuestion, IconBooks } from '@tabler/icons-react';

const NAV = [
  { href: '/', label: 'Briefing', Icon: IconMessageQuestion },
  { href: '/wissensbasis', label: 'Wissensbasis', Icon: IconBooks },
];

export default function Shell({ children }) {
  const path = usePathname();
  return (
    <div className="shell">
      <aside className="side">
        <Link href="/" className="brand" aria-label="Briefing-Bot Startseite">
          <span className="logo"><IconMountain size={19} stroke={1.8} aria-hidden="true" /></span>
          <span><span className="brand-name">Gletscherbank</span><br /><span className="brand-sub">Briefing-Bot</span></span>
        </Link>
        <nav className="nav" aria-label="Hauptnavigation">
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className={path === href ? 'active' : ''} aria-current={path === href ? 'page' : undefined} aria-label={label}>
              <Icon size={17} stroke={1.8} aria-hidden="true" /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="side-foot">Interne Demo<br />Fiktive Daten · ZHAW CAS</div>
      </aside>
      <main className="main"><div className="wrap">{children}</div></main>
    </div>
  );
}
