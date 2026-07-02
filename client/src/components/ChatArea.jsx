import { useEffect, useRef, useState } from "react";
import api from "../services/api";

function ChatArea({
  messages = [],
  files = [],
    chats,
    setChats,
    activeChatId
}) {

  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {

    const fetchBackend = async () => {

      try {

        const response =
          await api.get("/test");

        setMessage(
          response.data.message
        );

      } catch (error) {

        console.log(error);

      }

    };

    fetchBackend();

  }, []);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  const handleDeleteDocument =
    async (documentId) => {

      try {

        await api.delete(
          `/documents/${documentId}`
        );

        setChats(
          chats.map(chat => {

            if (
              chat.id !== activeChatId
            ) return chat;

            return {

              ...chat,

              files: chat.files.filter(
                file =>
                  file.documentId !==
                  documentId
              )

            };

          })
        );

        alert(
          "Document deleted successfully"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to delete document"
        );

      }

  };

  return (

    <div className="flex-1 flex flex-col p-6 text-gray-300 overflow-y-auto bg-zinc-950 min-h-0">

      <h2 className="text-3xl mb-4 text-white">
        Welcome to AI RAG Assistant
      </h2>

      <p className="mb-4">
        Upload a file and start asking questions
      </p>

      {files.length > 0 && (

        <div className="mb-4">

          <p className="text-blue-400 mb-2">
            Uploaded Files:
          </p>

          {files.map((file, index) => (

            <div
              key={index}
              className="flex items-center gap-2 text-blue-300 text-sm mb-1"
            >

              <span>
                📄 {file.name}
              </span>

              <button
                className="text-red-400 hover:text-red-300"
                onClick={() => {
                  console.log("DELETE FILE:", file);
                  handleDeleteDocument(
                    file.documentId
                  );
}}
              >
                ✕
              </button>

            </div>

          ))}

        </div>

      )}

      <p className="text-green-400 mb-6">
        {message}
      </p>

      <div className="mt-6 space-y-4">

        {Array.isArray(messages) &&
          messages.map((msg, index) => (

            <div
              key={index}
              className="bg-zinc-800 p-3 rounded-lg"
            >

              <strong>
                {msg.role === "user"
                  ? "You"
                  : "AI"}
                :
              </strong>{" "}

              {msg.text}

            </div>

          ))}

        <div ref={bottomRef}></div>

      </div>

    </div>

  );

}

export default ChatArea;