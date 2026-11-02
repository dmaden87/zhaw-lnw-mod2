import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'Briefing-Bot – Gletscherbank AG (Demo)',
  description: 'PoC für den Leistungsnachweis 2, CAS ZHAW. Fiktive Daten.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif', background: '#f4f5f7', color: '#1d2433' }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
