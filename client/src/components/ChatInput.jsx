import { useState } from "react";
import { askQuestion } from "../services/chatService";

function ChatInput({ messages, setMessages, chats, setChats, activeChatId, fileName }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim() || !activeChatId || loading) return;

    const currentQuestion = question.trim();
    setQuestion("");
    setLoading(true);

    try {
      const result = await askQuestion(currentQuestion, activeChatId);
      const newMessages = [...messages, { role: "user", text: currentQuestion }, { role: "ai", text: result.answer }];
      setMessages(newMessages);
      setChats(chats.map((chat) => chat.id === activeChatId ? { ...chat, messages: newMessages, title: chat.title.startsWith("Chat ") ? currentQuestion.slice(0, 25) : chat.title } : chat));
    } catch (error) {
      console.error(error);
      const newMessages = [...messages, { role: "user", text: currentQuestion }, { role: "ai", text: error.response?.data?.answer || "Something went wrong. Please try again." }];
      setMessages(newMessages);
      setChats(chats.map((chat) => chat.id === activeChatId ? { ...chat, messages: newMessages, title: chat.title.startsWith("Chat ") ? currentQuestion.slice(0, 25) : chat.title } : chat));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shrink-0 border-t border-white/8 bg-zinc-950/85 px-4 py-4 backdrop-blur-xl sm:px-8 sm:py-5">
      <div className="mx-auto max-w-4xl">
        {fileName && <p className="mb-2 truncate px-1 text-xs text-zinc-500">Answering from: <span className="text-blue-300">{fileName}</span></p>}
        <div className={`flex items-end gap-2 rounded-2xl border bg-zinc-900 p-2 shadow-xl shadow-black/15 transition ${activeChatId ? "border-white/10 focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/10" : "border-white/5 opacity-60"}`}>
          <textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); handleSend(); } }} placeholder={activeChatId ? "Ask about your documents..." : "Create a chat to begin"} disabled={!activeChatId || loading} rows={1} className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed" />
          <button type="button" onClick={handleSend} disabled={!question.trim() || !activeChatId || loading} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-lg text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600" aria-label="Send question">
            {loading ? <span className="animate-pulse text-sm">•••</span> : "↑"}
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-zinc-600">Press Enter to send · Shift + Enter for a new line</p>
      </div>
    </div>
  );
}

export default ChatInput;
