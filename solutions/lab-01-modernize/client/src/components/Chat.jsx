import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useChatConnection } from '../hooks/useChatConnection.js';
import MessageList from './MessageList.jsx';

export default function Chat() {
  const { user, token } = useAuth();
  const { messages, connected, sendMessage } = useChatConnection({
    token,
    currentUser: user,
  });
  const [draft, setDraft] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft('');
  }

  return (
    <div>
      <header className="d-flex align-items-center justify-content-between my-3">
        <h1 className="h4 mb-0">
          Hello, {user?.name ?? 'friend'}
        </h1>
        <div className="d-flex align-items-center gap-2">
          <span className={`badge bg-${connected ? 'success' : 'warning'}`}>
            {connected ? 'Connected' : 'Connecting…'}
          </span>
          <Link to="/logout" className="btn btn-sm btn-outline-secondary">
            Log out
          </Link>
        </div>
      </header>

      <MessageList messages={messages} currentUser={user} />

      <form onSubmit={handleSubmit} className="d-flex gap-2 mt-3">
        <input
          className="form-control"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          autoComplete="off"
        />
        <button className="btn btn-primary" disabled={!connected}>
          Send
        </button>
      </form>
    </div>
  );
}
