// Author: Ratneshwaran Maheswaran
// Affiliation: University College London
// Email: ratneshwaran.maheswaran.21@ucl.ac.uk

import './globals.css';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { ThemeProvider } from './contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Eva by 40seconds.org - Mental Health Assistant',
  description: 'Your personal AI-powered mental health support companion by 40seconds.org',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}