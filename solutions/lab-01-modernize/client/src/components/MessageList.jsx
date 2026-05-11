import { useEffect, useRef } from 'react';

export default function MessageList({ messages, currentUser }) {
  const scrollRef = useRef(null);

  // Synchronization with the DOM (scroll position) when messages change.
  // This is a real `useEffect` use case — we're poking an external system.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div ref={scrollRef} className="chat-window">
      {messages.length === 0 && (
        <p className="text-muted text-center mt-5">
          No messages yet. Say hi!
        </p>
      )}
      {messages.map((m) => {
        const mine = currentUser && m.uid && m.uid === currentUser.id;
        return (
          <div
            key={m.id ?? `${m.uid}-${m.text}`}
            className={[
              'message',
              mine ? 'mine' : 'other',
              m.sending ? 'sending' : '',
            ]
              .join(' ')
              .trim()}
          >
            <div className="author">
              {m.name ?? m.author?.name ?? m.author ?? 'Anonymous'}
            </div>
            <div>{m.text}</div>
          </div>
        );
      })}
    </div>
  );
}
