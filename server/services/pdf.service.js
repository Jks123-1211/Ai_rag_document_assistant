import { PDFParse } from "pdf-parse";//it is used to extract text from PDF files. It takes a PDF file as input and returns the extracted text as output. The library is built on top of the PDF.js library, which is a popular JavaScript library for rendering PDF documents in web browsers. PDFParse provides a simple API for extracting text from PDF files, making it easy to use in Node.js applications.
import fs from "fs";

export const extractPdfText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);

  const parser = new PDFParse({ data: dataBuffer });

  const result = await parser.getText();

  return result.text;
};