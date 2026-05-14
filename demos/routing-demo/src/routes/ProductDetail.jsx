import { Form, Link, useActionData, useLoaderData, useNavigation } from 'react-router';
import { buyProduct, getProduct } from '../data/products.js';

// Loader: runs on GET to /products/:id. Params arrive on `args.params`.
// Throwing an Error with a `.status` is enough to escalate to the root
// errorElement — that's how /products/nope triggers the 404 page.
export async function loader({ params }) {
  return await getProduct(params.id);
}

// Action: runs on POST. The Form below posts to its own URL, so this is
// what handles "Buy". Returning a plain object becomes `useActionData()`
// in the component; throwing escalates to the error boundary.
export async function action({ params, request }) {
  const formData = await request.formData();
  const qty = Number(formData.get('qty')) || 1;
  try {
    const receipt = await buyProduct(params.id, qty);
    return { ok: true, receipt };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export default function ProductDetail() {
  const product = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';

  return (
    <section>
      <p><Link to="/products">← Back to products</Link></p>
      <h2>{product.name}</h2>
      <p className="muted">{product.description}</p>
      <dl className="kv">
        <dt>Price</dt><dd>${product.price}</dd>
        <dt>In stock</dt><dd>{product.stock}</dd>
      </dl>

      <Form method="post">
        <label>
          Quantity:{' '}
          <input
            name="qty"
            type="number"
            min="1"
            max={product.stock || 1}
            defaultValue="1"
            disabled={product.stock === 0}
          />
        </label>{' '}
        <button type="submit" disabled={product.stock === 0 || submitting}>
          {submitting ? 'Buying…' : product.stock === 0 ? 'Sold out' : 'Buy'}
        </button>
      </Form>

      {actionData?.ok && (
        <p className="receipt">
          Bought {actionData.receipt.qty} × {actionData.receipt.name}.
          Remaining stock: {actionData.receipt.remaining}.
        </p>
      )}
      {actionData?.error && (
        <p className="error-inline" role="alert">{actionData.error}</p>
      )}
    </section>
  );
}
