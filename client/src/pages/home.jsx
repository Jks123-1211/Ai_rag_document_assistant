import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ChatArea from "../components/ChatArea";
import ChatInput from "../components/ChatInput";

function Home() {
  const [activeChatId, setActiveChatId] = useState(null);

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
    localStorage.setItem(
      "chatHistory",
      JSON.stringify(messages)
    );
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(
      "chats",
      JSON.stringify(chats)
    );
  }, [chats]);

  const activeChat = chats.find(
    (chat) => chat.id === activeChatId
  );

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar
        chats={chats}
        setChats={setChats}
        messages={messages}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        setMessages={setMessages}
        setFileName={setFileName}
      />

      <div className="flex flex-col flex-1 bg-zinc-950 min-h-0">
        <Navbar />
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
      </div>
    </div>
  );
}

export default Home;