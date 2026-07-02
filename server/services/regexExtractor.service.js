export const extractWithRegex = (
  question,
  context
) => {

  const lowerQuestion =
    question.toLowerCase();

  if (
    lowerQuestion.includes("receipt")
  ) {

    const match =
      context.match(
        /Receipt No:\s*([A-Z0-9]+)/i
      );

    if (match) {

      return {
        found: true,
        answer:
          `Receipt Number: ${match[1]}`
      };

    }

  }

  if (
    lowerQuestion.includes("transaction")
  ) {

    const match =
      context.match(
        /Transaction ID:\s*([A-Z0-9]+)/i
      );

    if (match) {

      return {
        found: true,
        answer:
          `Transaction ID: ${match[1]}`
      };

    }

  }

  return {
    found: false
  };

};