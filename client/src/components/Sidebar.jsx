import api from "../services/api";

function Sidebar({
  chats,
  setChats,
  activeChatId,
  setActiveChatId,
  setMessages,
  setFileName,
  sidebarOpen,
  closeSidebar,
}) {
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: `Chat ${chats.length + 1}`,
      messages: [],
      files: [],
    };

    setChats([...chats, newChat]);
    setActiveChatId(newChat.id);
    setMessages([]);
    setFileName("");
    localStorage.removeItem("chatHistory");
    closeSidebar();
  };

  const handleSelectChat = (chat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages || []);
    setFileName(chat.files?.[0]?.name || "");
    closeSidebar();
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await api.delete(`/delete-chat/${chatId}`);
    } catch (error) {
      console.error("Failed to delete chat on the server:", error);
    }

    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);

    if (activeChatId === chatId) {
      setActiveChatId(null);
      setMessages([]);
      setFileName("");
    }
  };

  const handleFileUpload = async (event) => {
    if (!activeChatId) {
      alert("Create a chat first");
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", activeChatId);

    try {
      const response = await api.post("/upload", formData);
      setChats(
        chats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                files: [
                  ...(chat.files || []),
                  { name: file.name, documentId: response.data.documentId },
                ],
              }
            : chat,
        ),
      );
      setFileName(file.name);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col border-r border-white/8 bg-zinc-900/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${sidebarOpen ? "translate-x-0" : ""}`}
    >
      <div className="mb-7 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 font-bold text-white shadow-lg shadow-blue-500/20">AI</div>
          <div>
            <h1 className="font-semibold tracking-tight text-white">RAG Assistant</h1>
            <p className="text-xs text-zinc-500">Document workspace</p>
          </div>
        </div>
        <button type="button" onClick={closeSidebar} className="text-zinc-500 hover:text-white lg:hidden" aria-label="Close menu">✕</button>
      </div>

      <button type="button" onClick={handleNewChat} className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 active:scale-[.98]">
        <span className="text-lg leading-none">+</span> New chat
      </button>

      <label className={`mb-6 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm font-medium transition ${activeChatId ? "border-zinc-700 bg-zinc-800/70 text-zinc-200 hover:border-blue-500/70 hover:bg-blue-500/10" : "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600"}`}>
        <span>↑</span> Upload PDF
        <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} disabled={!activeChatId} />
      </label>

      <div className="mb-2 flex items-center justify-between px-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Your chats</p>
        <span className="text-xs text-zinc-600">{chats.length}</span>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {chats.length === 0 ? (
          <p className="px-2 py-5 text-center text-sm leading-6 text-zinc-500">Create a chat, then upload a PDF to start analyzing.</p>
        ) : chats.map((chat) => (
          <div key={chat.id} onClick={() => handleSelectChat(chat)} className={`group flex cursor-pointer items-center gap-2 rounded-xl p-2.5 transition ${activeChatId === chat.id ? "bg-blue-600/20 text-white ring-1 ring-blue-400/25" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"}`}>
            <span className="text-sm">◌</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{chat.title}</p>
              <p className="mt-0.5 truncate text-xs text-zinc-500">{chat.files?.length ? `${chat.files.length} document${chat.files.length > 1 ? "s" : ""}` : "No document yet"}</p>
            </div>
            <button type="button" onClick={(event) => { event.stopPropagation(); handleDeleteChat(chat.id); }} className="rounded-md px-1.5 py-1 text-zinc-600 opacity-0 transition hover:bg-red-500/15 hover:text-red-300 group-hover:opacity-100" aria-label={`Delete ${chat.title}`}>✕</button>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-white/8 px-2 pt-4 text-xs leading-5 text-zinc-500">
        Upload a PDF and ask questions using AI-powered retrieval.
      </div>
    </aside>
  );
}

export default Sidebar;
