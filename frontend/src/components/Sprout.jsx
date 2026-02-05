// src/components/SproutSection.jsx
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import api from "../lib/api.js";
import askmeanything from "../assets/askmeanything.png";
const CHAT_ENDPOINT = "/api/chatbot";

/**
 * SproutSection (Floating AI Chatbot)
 * - Bottom-right launcher
 * - Popup is readable (high contrast)
 * - "Send" calls backend Chatbot API and renders reply inside the popup
 * - Adds: anti double-send + 429 cooldown/backoff + friendly 429 messaging
 */
export default function SproutSection({ subtitle }) {
  const [open, setOpen] = useState(false);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(messages);

  const convoRef = useRef(null);

  // ✅ Cooldown handling for 429 (rate limit)
  const [cooldownUntil, setCooldownUntil] = useState(0);

  // ✅ Exponential backoff counter for repeated 429s
  const rateLimitCountRef = useRef(0);

  // ✅ Anti double-send guard (e.g. Cmd+Enter + click, or rapid key repeats)
  const lastSendAtRef = useRef(0);

  // Keep a live reference to messages so onSend always has the latest history
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Auto-scroll conversation when new messages arrive (only when open)
  useEffect(() => {
    if (!open) return;
    const el = convoRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length]);

  // Tick down cooldown so UI re-enables without user refresh
  useEffect(() => {
    if (!cooldownUntil) return;
    const id = setInterval(() => {
      if (Date.now() >= cooldownUntil) setCooldownUntil(0);
    }, 250);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  const tip = useMemo(() => {
    const ua = navigator.userAgent || "";
    const isMac = /Macintosh|Mac OS X|MacIntel/i.test(ua);
    return isMac
      ? "Tip: Use ⌘+Enter (Mac) to send."
      : "Tip: Use Ctrl+Enter (Windows/Linux) to send.";
  }, []);

  const canSend =
    input.trim().length > 0 &&
    !sending &&
    (cooldownUntil === 0 || Date.now() >= cooldownUntil);

  const parseRetryAfterMs = (err) => {
    // If your backend sends Retry-After, respect it.
    const ra = err?.response?.headers?.["retry-after"];
    if (!ra) return 1500;

    // Retry-After is often seconds (string)
    const seconds = Number(ra);
    if (!Number.isNaN(seconds) && seconds >= 0) return seconds * 1000;

    return 1500;
  };

  const computeCooldownMs = (err) => {
    const retryAfterMs = parseRetryAfterMs(err);
    // 1st 429 -> 1.5s, 2nd -> 3s, 3rd -> 6s ... capped
    const backoffMs =
      1500 * Math.pow(2, Math.max(0, rateLimitCountRef.current - 1));
    return Math.min(30_000, Math.max(retryAfterMs, backoffMs));
  };

  const onClear = useCallback(() => {
    if (sending) return;
    setError("");
    setMessages([]);
    setInput("");
  }, [sending]);

  const onSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    // Cooldown active? don't send.
    if (cooldownUntil && Date.now() < cooldownUntil) return;

    // Prevent accidental double-send within 500ms
    const now = Date.now();
    if (now - lastSendAtRef.current < 500) return;
    lastSendAtRef.current = now;

    setError("");
    setSending(true);

    // Optimistically add the user message immediately
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    try {
      // Always build payload from the latest known message list
      const history = messagesRef.current || [];

      const payload = {
        messages: [
          ...history.map((m) => ({ role: m.role, content: m.text })),
          { role: "user", content: text },
        ],
      };

      const res = await api.post(CHAT_ENDPOINT, payload);

      const replyText =
        res?.data?.content ??
        res?.data?.reply ??
        res?.data?.message ??
        (typeof res?.data === "string" ? res.data : "");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: replyText ? String(replyText) : "No reply received.",
        },
      ]);

      // Success resets rate limit backoff
      rateLimitCountRef.current = 0;
    } catch (err) {
      const status = err?.response?.status;

      if (status === 429) {
        rateLimitCountRef.current += 1;
        const waitMs = computeCooldownMs(err);
        setCooldownUntil(Date.now() + waitMs);

        setError(
          `Rate limited (429). Please wait ${Math.ceil(
            waitMs / 1000
          )}s and try again.`
        );
      } else {
        console.error("SproutSection chatbot send failed:", err);
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "Failed to send message."
        );
      }
    } finally {
      setSending(false);
    }
  }, [input, sending, cooldownUntil]);

  const onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <>
      {/* Keeps text available if you want it for accessibility/metadata, but no page space is taken */}
      <div style={{ display: "none" }}>
        {subtitle ?? "Instant access to the AI Chatbot."}
      </div>

      {/* Floating launcher + popup (BOTTOM-RIGHT) */}
      <div
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 9999,
          display: "grid",
          gap: 10,
          alignItems: "end",
          pointerEvents: "auto",
        }}
      >
        {/* Popup */}
        {open && (
          <div
            style={{
              width: "min(420px, calc(100vw - 36px))",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(10,10,14,0.92)",
              color: "rgba(255,255,255,0.92)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
              padding: 14,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 900 }}>AI Chatbot</div>
              <div style={{ flex: 1 }} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chatbot"
                title="Close"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.92)",
                  cursor: "pointer",
                  fontWeight: 900,
                }}
              >
                ✕
              </button>
            </div>

            {/* Error */}
            {error ? (
              <div
                style={{
                  marginBottom: 10,
                  padding: 10,
                  borderRadius: 12,
                  border: "1px solid rgba(255,0,0,0.25)",
                  background: "rgba(255,0,0,0.12)",
                  color: "rgba(255,255,255,0.92)",
                  wordBreak: "break-word",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            ) : null}

            {/* Conversation */}
            <div
              ref={convoRef}
              style={{
                display: "grid",
                gap: 8,
                maxHeight: 180,
                overflow: "auto",
                paddingRight: 6,
                marginBottom: 10,
                overscrollBehavior: "contain",
              }}
            >
              {/* Removed the “Say hi…” placeholder */}
              {messages.length === 0
                ? null
                : messages.map((m, idx) => {
                    const isUser = m.role === "user";
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "grid",
                          justifyItems: isUser ? "end" : "start",
                          gap: 4,
                        }}
                      >
                        <div style={{ fontSize: 11, opacity: 0.7 }}>
                          {isUser ? "You" : "AI"}
                        </div>
                        <div
                          style={{
                            maxWidth: "100%",
                            padding: "8px 10px",
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: isUser
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(255,255,255,0.05)",
                            lineHeight: 1.4,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            fontSize: 13,
                          }}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })}
            </div>

            {/* Input */}
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Your message</div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your message..."
                style={{
                  width: "100%",
                  minHeight: 90,
                  resize: "none",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.92)",
                  padding: 10,
                  outline: "none",
                }}
              />

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={onClear}
                  disabled={sending}
                  style={{
                    borderRadius: 999,
                    padding: "10px 18px",
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.92)",
                    fontWeight: 800,
                    cursor: sending ? "not-allowed" : "pointer",
                    opacity: sending ? 0.6 : 1,
                  }}
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={onSend}
                  disabled={!canSend}
                  style={{
                    borderRadius: 999,
                    padding: "10px 18px",
                    border: "1px solid rgba(255,255,255,0.22)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.92)",
                    fontWeight: 800,
                    cursor: canSend ? "pointer" : "not-allowed",
                    opacity: canSend ? 1 : 0.55,
                  }}
                >
                  {sending
                    ? "Sending…"
                    : cooldownUntil && Date.now() < cooldownUntil
                    ? "Wait…"
                    : "Send"}
                </button>
              </div>

              <div style={{ fontSize: 12, opacity: 0.7 }}>{tip}</div>
            </div>
          </div>
        )}

        {/* Launcher (circle icon) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Hide AI Chatbot" : "Open AI Chatbot"}
          title={open ? "Hide AI Chatbot" : "Open AI Chatbot"}
          style={{
            background: "transparent",
            border: "none",
          }}
        >
          <img src={askmeanything}></img>
        </button>
      </div>
    </>
  );
}