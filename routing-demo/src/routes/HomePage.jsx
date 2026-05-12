import { Link } from 'react-router';

export default function HomePage() {
  return (
    <section>
      <h2>Home</h2>
      <p>
        This is a small in-class demo of React Router v7's data-router APIs.
        Click through the routes below and watch the navigation indicator
        in the header.
      </p>
      <ul>
        <li><Link to="/about">/about</Link> — plain element, no loader</li>
        <li><Link to="/products">/products</Link> — element + loader</li>
        <li><Link to="/products/p-101">/products/p-101</Link> — nested loader + action (buy)</li>
        <li><Link to="/products/nope">/products/nope</Link> — triggers the root error boundary</li>
      </ul>
    </section>
  );
}
