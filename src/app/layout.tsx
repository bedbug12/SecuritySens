import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { ProgressProvider } from '@/lib/contexts/ProgressContext';
import { NotificationProvider } from '@/components/feedback/NotificationProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: 'SecuritySense - Formation au Social Engineering',
  description: 'Plateforme interactive de sensibilisation aux attaques d\'ingénierie sociale',
  keywords: ['cybersécurité', 'social engineering', 'formation', 'entreprise', 'phishing'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-gray-950 text-gray-100 min-h-screen overflow-x-hidden">
        <ProgressProvider>
          <NotificationProvider>
            <div className="flex min-h-screen">
              <Navigation />
              {/* Ajustement du padding pour le contenu principal */}
              <div className="flex-1 pl-0 md:pl-64">
                <main className="min-h-screen">
                  {children}
                </main>
              </div>
            </div>
          </NotificationProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}