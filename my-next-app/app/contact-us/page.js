import { subscribeAction } from './actions';
import SubscribeForm from './SubscribeForm';

// Server Component. The Server Action lives in ./actions.js with the
// 'use server' directive at the top — it's importable from anywhere
// (including Client Components) and Next.js takes care of the RPC.
export default function Contact() {
  return (
    <article>
      <h1>Contact us</h1>
      <p>Submit the form. Behind the scenes:</p>
      <ol>
        <li>The browser POSTs to this URL.</li>
        <li>Next.js dispatches to <code>subscribeAction</code> on the server.</li>
        <li>The action runs server-side validation.</li>
        <li>The new state flows back through <code>useActionState</code>.</li>
      </ol>
      <p>
        Try the failure modes: empty email, invalid email, the literal
        string <code>boom@example.com</code>.
      </p>

      <SubscribeForm action={subscribeAction} />
    </article>
  );
}
