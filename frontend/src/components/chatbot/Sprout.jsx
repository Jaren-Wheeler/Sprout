import { useEffect, useRef, useState } from 'react';
import sproutChatbot from '../../assets/askmeanything.png';

export default function Sprout({
  title = 'Sprout Assistant',
  subtitle = 'Ask me anything',
  welcomeMessage = 'Hey! How can I help?',
  onSend,
  onBudgetChange,
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: welcomeMessage },
  ]);

  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function handleSend() {
    if (!input.trim() || sending) return;

    const userText = input;
    setInput('');
    setSending(true);

    setMessages((prev) => [...prev, { role: 'user', text: userText }]);

    try {
      const reply = onSend
        ? await onSend(userText)
        : 'This is a demo reply. Plug in your API!';

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      onBudgetChange?.();
    } catch (err) {
      console.log('Error: ', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Something went wrong.' },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-[10rem] w-[10rem] items-center justify-center"
        >
          <img src={sproutChatbot}></img>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-green-600 px-4 py-3 text-white">
            <div>
              <div className="font-semibold">{title}</div>
              <div className="text-xs opacity-90">{subtitle}</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-sm hover:bg-green-700"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-800 shadow'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="text-xs text-gray-400">Assistant is typing…</div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message…"
              className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={sending}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
