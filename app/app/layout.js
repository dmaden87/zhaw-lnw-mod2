import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata = {
  title: 'Briefing-Bot – Gletscherbank AG (Demo)',
  description: 'PoC für den Leistungsnachweis 2, CAS ZHAW. Fiktive Daten.',
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#0f2a4a' };

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
