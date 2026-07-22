import { useEffect, useRef, useState } from "react";
import api from "../services/api";

function ChatArea({ messages = [], files = [], chats, setChats, activeChatId }) {
  const [backendMessage, setBackendMessage] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchBackend = async () => {
      try {
        const response = await api.get("/test");
        setBackendMessage(response.data.message);
      } catch (error) {
        console.error("Backend status check failed:", error);
      }
    };
    fetchBackend();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDeleteDocument = async (documentId) => {
    try {
      await api.delete(`/documents/${documentId}`);
      setChats(chats.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        return { ...chat, files: chat.files.filter((file) => file.documentId !== documentId) };
      }));
    } catch (error) {
      console.error("Document delete error:", error);
      alert("Failed to delete document. Please try again.");
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-6 sm:px-8 sm:py-10">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-3xl shadow-xl shadow-blue-950/40">✦</div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Turn documents into answers</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base">Create a chat, upload a PDF, and ask questions. Answers are generated from your document context.</p>
            {!activeChatId && <div className="mt-6 rounded-xl border border-amber-400/15 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">Start by creating a new chat from the sidebar.</div>}
          </div>
        ) : (
          <div className="space-y-5 py-2">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <article key={`${msg.role}-${index}`} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-bold text-white">AI</div>}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${isUser ? "rounded-tr-sm bg-blue-600 text-white" : "rounded-tl-sm border border-white/8 bg-zinc-900 text-zinc-200"}`}>
                    {!isUser && <p className="mb-1 text-xs font-semibold text-blue-300">Document assistant</p>}
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {files.length > 0 && (
          <section className="mt-5 rounded-2xl border border-white/8 bg-zinc-900/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Uploaded documents</p>
              <span className="text-xs text-zinc-600">{files.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {files.map((file) => (
                <div key={file.documentId} className="flex max-w-full items-center gap-2 rounded-lg border border-blue-400/15 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">
                  <span>▧</span><span className="max-w-48 truncate">{file.name}</span>
                  <button type="button" className="ml-1 text-blue-300/60 transition hover:text-red-300" onClick={() => handleDeleteDocument(file.documentId)} aria-label={`Delete ${file.name}`}>✕</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {backendMessage && <p className="mt-5 text-center text-xs text-emerald-400/80">● {backendMessage}</p>}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatArea;
