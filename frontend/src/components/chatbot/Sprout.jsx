import { useEffect, useRef, useState } from "react";
import sproutChatbot from "../../assets/askmeanything.png";
import sproutChatbotHover from "../../assets/askmeanything-hover.png";

export default function Sprout({
  title = "Sprout Assistant",
  subtitle = "Ask me anything",
  welcomeMessage = "Hey! How can I help?",
  onSend,
  onBudgetChange,
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: welcomeMessage },
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
    setInput("");
    setSending(true);
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    try {
      const reply = onSend
        ? await onSend(userText)
        : "This is a demo reply. Plug in your API!";

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      onBudgetChange?.();
    } catch (err) {
      console.log("Error: ", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open Sprout Assistant"
          className="
            group fixed bottom-4 right-4 z-[200]
            flex items-center gap-3
            rounded-full border border-[rgba(128,86,36,0.18)] dark:border-white/10
            bg-[linear-gradient(180deg,rgba(255,252,246,0.97),rgba(247,239,220,0.95))] dark:bg-[linear-gradient(180deg,rgba(26,30,41,0.96),rgba(19,23,31,0.95))]
            px-3.5 py-3 pr-3.5
            text-left shadow-[0_18px_40px_rgba(87,60,26,0.2)]
            dark:shadow-[0_20px_42px_rgba(0,0,0,0.42)]
            backdrop-blur-md
            transition-all duration-200 ease-out
            hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(87,60,26,0.24)]
            focus:outline-none focus:ring-4 focus:ring-[rgba(229,180,61,0.28)]
            sm:bottom-5 sm:right-5
          "
        >
          <div
            className="
              relative flex h-[4.65rem] w-[4.65rem] shrink-0 items-center justify-center
              rounded-full border border-[rgba(128,86,36,0.16)] dark:border-white/10
              bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.98),rgba(245,232,203,0.96))] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(54,62,82,0.95),rgba(28,34,47,0.96))]
              shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_10px_24px_rgba(87,60,26,0.14)]
              dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_28px_rgba(0,0,0,0.34)]
            "
          >
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-white bg-[#67a14f]" />
            <img
              src={sproutChatbot}
              alt=""
              className="absolute h-[5.4rem] w-[5.4rem] object-contain transition-all duration-200 group-hover:scale-105 group-hover:opacity-0"
            />
            <img
              src={sproutChatbotHover}
              alt=""
              className="absolute h-[5.4rem] w-[5.4rem] object-contain opacity-0 transition-all duration-200 group-hover:scale-105 group-hover:opacity-100"
            />
          </div>

          <div className="hidden min-w-0 sm:block pr-1">
            <div className="text-sm font-semibold text-[#4a3320] dark:text-[#f4ead0]">
              Ask Sprout
            </div>
          </div>
        </button>
      )}

      {open && (
        <div
          className="
            fixed bottom-4 right-4 z-[210]
            flex h-[min(70vh,560px)] w-[calc(100vw-1.5rem)] max-w-[390px]
            flex-col overflow-hidden rounded-[28px]
            border border-[rgba(128,86,36,0.18)] dark:border-white/10
            bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(247,239,222,0.96))] dark:bg-[linear-gradient(180deg,rgba(25,30,40,0.98),rgba(18,22,31,0.98))]
            shadow-[0_32px_70px_rgba(87,60,26,0.24)]
            dark:shadow-[0_32px_70px_rgba(0,0,0,0.48)]
            backdrop-blur-xl
            sm:bottom-5 sm:right-5
          "
        >
          <div className="flex items-center justify-between border-b border-[rgba(128,86,36,0.12)] bg-[linear-gradient(135deg,rgba(255,249,238,0.98),rgba(244,233,204,0.92))] px-4 py-3.5 text-[#4a3320] dark:border-white/8 dark:bg-[linear-gradient(135deg,rgba(32,38,51,0.98),rgba(22,27,37,0.94))] dark:text-[#f4ead0]">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(128,86,36,0.14)] bg-white/75 shadow-[0_10px_24px_rgba(87,60,26,0.12)] dark:border-white/10 dark:bg-white/8 dark:shadow-[0_10px_24px_rgba(0,0,0,0.32)]">
                <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#67a14f]" />
                <img
                  src={sproutChatbot}
                  alt=""
                  className="h-10 w-10 object-contain"
                />
              </div>

              <div>
                <div className="font-semibold">{title}</div>
                <div className="text-xs text-[rgba(74,51,32,0.68)] dark:text-white/60">
                  {subtitle}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Sprout Assistant"
              className="rounded-full border border-[rgba(128,86,36,0.12)] bg-white/75 px-3 py-1.5 text-sm text-[rgba(74,51,32,0.72)] transition hover:bg-white dark:border-white/10 dark:bg-white/8 dark:text-white/70 dark:hover:bg-white/12"
            >
              Close
            </button>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(248,242,228,0.5))] p-4 dark:bg-[linear-gradient(180deg,rgba(20,24,33,0.42),rgba(15,19,27,0.62))]"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    m.role === "user"
                      ? "bg-[linear-gradient(180deg,#67a14f,#4f7f43)] text-white shadow-[0_14px_28px_rgba(79,127,67,0.22)]"
                      : "border border-[rgba(128,86,36,0.1)] bg-white/88 text-[#4a3320] shadow-[0_12px_24px_rgba(87,60,26,0.08)] dark:border-white/8 dark:bg-white/8 dark:text-[#f4ead0] dark:shadow-[0_12px_24px_rgba(0,0,0,0.24)]"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {sending && (
              <div className="text-xs text-[rgba(74,51,32,0.52)] dark:text-white/50">
                Sprout is thinking...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-[rgba(128,86,36,0.12)] bg-white/72 p-3 dark:border-white/8 dark:bg-white/6">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-2xl border border-[rgba(128,86,36,0.14)] bg-[rgba(255,252,246,0.96)] px-4 py-3 text-sm text-[#4a3320] placeholder:text-[rgba(74,51,32,0.42)] focus:outline-none focus:ring-2 focus:ring-[rgba(103,161,79,0.28)] dark:border-white/10 dark:bg-[#f5ead7] dark:text-[#2d2217] dark:placeholder:text-[rgba(45,34,23,0.42)]"
              style={{ color: "#2d2217", caretColor: "#2d2217", WebkitTextFillColor: "#2d2217" }}
              disabled={sending}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="rounded-2xl bg-[linear-gradient(180deg,#67a14f,#4f7f43)] px-4 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(79,127,67,0.24)] transition hover:brightness-105 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
