'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconMountain, IconMessageQuestion, IconBooks, IconUsers, IconLogout } from '@tabler/icons-react';
import { useMe, atLeast } from '../lib/useMe';

const NAV = [
  { href: '/', label: 'Briefing', Icon: IconMessageQuestion },
  { href: '/wissensbasis', label: 'Wissensbasis', Icon: IconBooks },
];

export default function Shell({ children }) {
  const path = usePathname();
  const me = useMe();
  const nav = atLeast(me, 'admin') ? [...NAV, { href: '/benutzer', label: 'Benutzer', Icon: IconUsers }] : NAV;
  return (
    <div className="shell">
      <aside className="side">
        <Link href="/" className="brand" aria-label="Briefing-Bot Startseite">
          <span className="logo"><IconMountain size={19} stroke={1.8} aria-hidden="true" /></span>
          <span><span className="brand-name">Gletscherbank</span><br /><span className="brand-sub">Briefing-Bot</span></span>
        </Link>
        <nav className="nav" aria-label="Hauptnavigation">
          {nav.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className={path === href ? 'active' : ''} aria-current={path === href ? 'page' : undefined} aria-label={label}>
              <Icon size={17} stroke={1.8} aria-hidden="true" /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="side-foot">
          {me && <div className="me"><strong>{me.name}</strong><br />{me.roleLabel}</div>}
          <form method="post" action="/api/logout"><button type="submit" className="logout" aria-label="Abmelden"><IconLogout size={16} stroke={1.8} aria-hidden="true" /><span>Abmelden</span></button></form>
          <div className="foot-note">Interne Demo · Fiktive Daten · ZHAW CAS</div>
        </div>
      </aside>
      <main className="main"><div className="wrap">{children}</div></main>
    </div>
  );
}
