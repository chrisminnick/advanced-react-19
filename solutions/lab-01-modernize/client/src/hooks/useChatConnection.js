import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * Owns the socket lifecycle for the chat. Returns the live message list,
 * a connection flag, and an imperative `sendMessage(text)`.
 *
 * Two things to look at if you're reviewing this with students:
 *   1. ONE useEffect for the whole socket lifecycle. Setup AND teardown
 *      live in the same effect, so React can't get them out of sync.
 *   2. The handler uses the FUNCTIONAL setMessages updater, not
 *      `setMessages([...messages, msg])`. The latter would close over a
 *      stale `messages` value from when the effect first ran.
 */
export function useChatConnection({ token, currentUser } = {}) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    // Vite proxies /socket.io to the chat server on port 8081 (see vite.config.js).
    const socket = io({ auth: { token } });
    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onMessage = (msg) =>
      setMessages((prev) => [
        ...prev,
        { ...msg, id: msg.id ?? crypto.randomUUID() },
      ]);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  function sendMessage(text) {
    if (!socketRef.current) return;
    socketRef.current.timeout(5000).emit('message', {
      text,
      uid: currentUser?.id,
      name: currentUser?.name,
    });
  }

  return { messages, connected, sendMessage };
}
