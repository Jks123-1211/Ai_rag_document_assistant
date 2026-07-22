import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatArea from "../components/ChatArea";
import ChatInput from "../components/ChatInput";

function Home() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [fileName, setFileName] = useState("");
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("chats");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  return (
    <main className="flex h-dvh overflow-hidden bg-zinc-950 text-zinc-100">
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          aria-label="Close chat menu"
        />
      )}

      <Sidebar
        chats={chats}
        setChats={setChats}
        messages={messages}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        setMessages={setMessages}
        setFileName={setFileName}
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <section className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.10),_transparent_38%)]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <ChatArea
          messages={messages}
          files={activeChat?.files || []}
          chats={chats}
          setChats={setChats}
          activeChatId={activeChatId}
        />
        <ChatInput
          messages={messages}
          setMessages={setMessages}
          chats={chats}
          setChats={setChats}
          activeChatId={activeChatId}
          fileName={fileName}
          setFileName={setFileName}
        />
      </section>
    </main>
  );
}

export default Home;
