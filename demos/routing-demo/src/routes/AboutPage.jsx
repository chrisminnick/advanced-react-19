export default function AboutPage() {
  return (
    <section>
      <h2>About</h2>
      <p>
        Plain Server-rendered-from-client-bundle page. No loader, no action —
        just a component the router knows how to mount.
      </p>
      <p>
        Notice how the URL changed without a full page reload. That's the
        router doing client-side navigation; the rest of the page (header
        + nav + footer) didn't unmount.
      </p>
    </section>
  );
}
