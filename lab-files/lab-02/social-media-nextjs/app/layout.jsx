import './globals.css';

export const metadata = {
  title: 'social-media-nextjs',
  description: 'Advanced React Lab Starter — Next.js 15 App Router',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
