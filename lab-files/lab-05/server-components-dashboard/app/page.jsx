import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Lab 5 starter</h1>
      <p>
        This is the home page. The dashboard you&apos;ll build lives at{' '}
        <Link href="/dashboard">/dashboard</Link>.
      </p>
    </main>
  );
}
