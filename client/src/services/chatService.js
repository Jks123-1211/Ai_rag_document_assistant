import api from "./api";

export const askQuestion = async (
  question,
  chatId
) => {

  const response = await api.post(
    "/chat",
    {
      question,
      chatId,
    }
  );

  return response.data;
};