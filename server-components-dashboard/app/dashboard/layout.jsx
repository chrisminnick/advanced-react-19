import Link from 'next/link';

export default function DashboardLayout({ children }) {
  return (
    <>
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong>Project tracker</strong>
          <nav>
            <Link href="/" style={{ color: '#475569' }}>Home</Link>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
}
