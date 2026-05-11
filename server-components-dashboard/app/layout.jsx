import './globals.css';

export const metadata = {
  title: 'Project tracker',
  description: 'Lab 5 — Server Components Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
