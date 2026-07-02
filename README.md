# AI Powered RAG Assistant

An AI-powered Retrieval-Augmented Generation (RAG) application that enables users to upload PDF documents and ask questions in natural language. The system retrieves the most relevant information from uploaded documents using semantic search and generates accurate answers using Google's Gemini AI.

---

## Features

- Upload PDF documents
- Semantic document search using FAISS
- Google Gemini AI integration
- Context-aware question answering
- Multi-chat support
- Chat history
- Document management (Upload/Delete)
- Answer caching
- Conversation memory
- Automatic document chunking
- Query expansion

---

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### AI

- Google Gemini
- FAISS Vector Search
- Embedding Model

---

## Project Structure

```
AI-RAG-Assistant
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── uploads
│   └── package.json
│
├── README.md
├── .gitignore
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-RAG-Assistant.git
```

---

### Backend Setup

```bash
cd server
npm install
npm run dev
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the `server` folder.

```env
MONGODB_URI=YOUR_MONGODB_URI
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

## Workflow

1. Create a new chat.
2. Upload one or more PDF documents.
3. Documents are chunked and converted into embeddings.
4. Embeddings are stored in a FAISS vector index.
5. Ask questions about the uploaded documents.
6. The application retrieves the most relevant chunks.
7. Gemini AI generates answers using only the retrieved context.

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/upload` | Upload PDF |
| POST | `/api/chat` | Ask Questions |
| DELETE | `/api/delete-chat/:chatId` | Delete Chat |
| GET | `/documents/:chatId` | Get Uploaded Documents |
| DELETE | `/documents/:documentId` | Delete Document |

---

## Future Improvements

- User Authentication
- OCR for Scanned PDFs
- Persistent FAISS Storage
- Multi-user Support
- Cloud Deployment
- Streaming AI Responses

---

## Author

**Jinendra Sethia**

B.Tech Information Technology

Manipal Institute of Technology, Bengaluru

---

## License

This project is developed for educational and internship purposes.