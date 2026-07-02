import { useState } from "react";
import { askQuestion } from "../services/chatService";

function ChatInput({
  messages,
  setMessages,
  chats,
  setChats,
  activeChatId,
  fileName,
  setFileName,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {

    if (!question.trim()) return;
    const currentQuestion = question;
    setQuestion("");

    try {

      setLoading(true);

      const result = await askQuestion(currentQuestion,activeChatId);

      const newMessages = [
        ...messages,
        {
          role: "user",
          text: currentQuestion,
        },
        {
          role: "ai",
          text: result.answer,
        },
      ];

      setMessages(newMessages);

      setChats(
        chats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: newMessages,

                title:
                  chat.title.startsWith("Chat ")
                    ? currentQuestion.slice(0, 25)
                    : chat.title,
              }
            : chat
        )
      );

      setQuestion("");

    } catch (error) {

      console.error(error);

      const newMessages = [
        ...messages,
        {
          role: "user",
          text: currentQuestion,
        },
        {
          role: "ai",
          text:
            error.response?.data?.answer ||
            "Something went wrong",
        },
      ];

      setMessages(newMessages);

      setChats(
        chats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: newMessages,

                title:
                  chat.title.startsWith("Chat ")
                    ? currentQuestion.slice(0, 25)
                    : chat.title,
              }
            : chat
        )
      );
      setQuestion("");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="p-4 bg-zinc-900 border-t border-zinc-700">

      <div className="flex gap-2">

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Ask something..."
          className="flex-1 p-3 rounded-lg bg-zinc-800 text-white"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 px-6 rounded-lg text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Send"}
        </button>

      </div>

    </div>
  );
}

export default ChatInput;