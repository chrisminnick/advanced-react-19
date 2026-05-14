import { Link, useLoaderData } from 'react-router';
import { listProducts } from '../data/products.js';

// Loaders are async functions exported from the route file. They run
// BEFORE the element mounts, so by the time <ProductsPage /> renders,
// `useLoaderData()` returns real data — no loading state needed in the
// component body.
export async function loader() {
  return await listProducts();
}

export default function ProductsPage() {
  const products = useLoaderData();
  return (
    <section>
      <h2>Products</h2>
      <p>
        The loader ran before this component mounted. The pending UI in the
        header showed during that 300ms wait.
      </p>
      <ul className="product-list">
        {products.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link>
            <span className="meta"> · ${p.price}{p.stock === 0 ? ' · out of stock' : ''}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
