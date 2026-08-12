# 🤖 AI Business Automation SaaS

A full-stack AI-powered business automation platform with real-time web search and agentic AI workflows.

## 🛠️ Tech Stack
- **Frontend:** React.js
- **Backend:** FastAPI (Python)
- **Automation:** n8n
- **LLM:** Groq (Llama 3.3 70B)
- **Search:** Tavily AI
- **Container:** Docker

## 🏗️ Architecture
User → React UI → FastAPI → n8n Webhook → AI Agent → Groq + Tavily → Response

## ⚙️ Features
- Real-time AI Q&A
- Agentic AI with autonomous tool use
- Live web search integration
- REST API backend
- n8n workflow automation

## 🚀 Run Locally
1. Start n8n: `docker run -p 5678:5678 docker.n8n.io/n8nio/n8n`
2. Start backend: `uvicorn main:app --reload`
3. Start frontend: `npm start`