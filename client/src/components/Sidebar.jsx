import api from "../services/api";

function Sidebar({
  chats,
  setChats,
  activeChatId,
  setActiveChatId,
  setMessages,
  setFileName,
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

  };

  const handleSelectChat = (chat) => {

    setActiveChatId(chat.id);
    setMessages(chat.messages || []);

  };

  const handleDeleteChat = async (chatId) => {

    try {

      await api.delete(
        `/delete-chat/${chatId}`
      );

    } catch (error) {

      console.log(error);

    }

    const updatedChats =
      chats.filter(
        chat => chat.id !== chatId
      );

    setChats(updatedChats);

    if (activeChatId === chatId) {

      setActiveChatId(null);
      setMessages([]);
      setFileName("");

    }

  };

  const handleFileUpload = async (e) => {

    if (!activeChatId) {

      alert("Create a chat first");
      return;

    }

    const file = e.target.files[0];

    if (!file) return;

    console.log(
      "FILE SELECTED:",
      file
    );

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "chatId",
      activeChatId
    );

    try {

      console.log(
        "UPLOADING..."
      );

      const response =
        await api.post(
          "/upload",
          formData
        );

      console.log(
        "UPLOAD RESPONSE:"
      );

      console.log(
        response.data
      );

      setChats(
        chats.map(chat =>
          chat.id === activeChatId
            ? {
                ...chat,
                files: [
                  ...(chat.files || []),
                  {
                    name: file.name,
                    documentId:
                      response.data.documentId
                  }
                ]
              }
            : chat
        )
      );

      setFileName(file.name);

      alert(
        "File uploaded successfully"
      );

    } catch (error) {

      console.log(
        "UPLOAD ERROR:"
      );

      console.log(error);

      alert(
        "Upload failed"
      );

    }

  };

  return (

    <div className="w-64 bg-zinc-900 text-white p-4 flex flex-col">

      <h1 className="text-2xl font-bold mb-6">
        AI RAG Assistant
      </h1>

      <button
        className="bg-zinc-800 p-3 rounded-lg mb-4 hover:bg-zinc-700"
        onClick={handleNewChat}
      >
        + New Chat
      </button>

      <label
        className={`p-3 rounded-lg text-center ${
          activeChatId
            ? "bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
            : "bg-zinc-800 opacity-50 cursor-not-allowed"
        }`}
      >

        Upload File

        <input
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          disabled={!activeChatId}
        />

      </label>

      <div className="mt-8">

        <p className="text-gray-400 text-sm mb-2">
          Chat History
        </p>

        <div className="space-y-2">

          {chats.map(chat => (

            <div
              key={chat.id}
              onClick={() =>
                handleSelectChat(chat)
              }
              className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                activeChatId === chat.id
                  ? "bg-blue-600"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >

              <div className="flex flex-col overflow-hidden">

                <span className="truncate">
                  {chat.title}
                </span>

                {chat.files?.length > 0 && (

                  <span className="text-xs text-gray-300 truncate">

                    {chat.files.length === 1
                      ? `📄 ${chat.files[0].name}`
                      : `📄 ${chat.files.length} files`}

                  </span>

                )}

              </div>

              <button
                onClick={(e) => {

                  e.stopPropagation();

                  handleDeleteChat(
                    chat.id
                  );

                }}
                className="text-red-400 hover:text-red-300 ml-2"
              >
                ✕
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default Sidebar;