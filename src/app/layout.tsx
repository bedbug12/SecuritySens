// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { ProgressProvider } from '@/lib/contexts/ProgressContext';
import { NotificationProvider } from '@/components/feedback/NotificationProvider';
import { SessionProviderWrapper } from '@/components/auth/SessionProviderWrapper';

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
      <body className="bg-gray-950 text-gray-100">
        <SessionProviderWrapper>
          <ProgressProvider>
            <NotificationProvider>
              <div className="flex min-h-screen">
                <Navigation />
                <main className="flex-1 md:ml-64 overflow-y-auto ">
                  {children}
                </main>
              </div>
            </NotificationProvider>
          </ProgressProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}