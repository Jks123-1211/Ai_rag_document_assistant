import Chat from "../models/Chat.js";

export const addMessage = async (
  chatId,
  role,
  content
) => {

  console.log(
    "ADD MESSAGE:",
    {
      chatId,
      role
    }
  );

  await Chat.create({
    chatId: String(chatId),
    role,
    content
  });

};



export const getChatMemory =
  async (
    chatId
  ) => {

    return await Chat
      .find({
        chatId: String(chatId)
      })
      .sort({
        createdAt: 1
      });

  };

export const clearChatMemory =
  async (
    chatId
  ) => {

    await Chat.deleteMany({
      chatId: String(chatId)
    });

  };