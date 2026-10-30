import { useState, useRef, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi! I'm your AI Business Assistant. Ask me anything or upload a file!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const userMessage = input || `Uploaded file: ${fileName}`;
    setMessages(prev => [...prev, { role: "user", content: userMessage, file: fileName }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/ask?query=${encodeURIComponent(input || "Analyze this file: " + fileName)}`,
        { method: "POST" }
      );
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", content: data?.answer?.output || data?.answer?.message || "Something went wrong!" }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", content: "Error occurred. Try again!" }]);
    }

    setLoading(false);
    setFile(null);
    setFileName("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#1a1a2e", fontFamily: "Inter, sans-serif" }}>
      
      {/* Sidebar */}
      <div style={{ width: "260px", background: "#0f0f1a", borderRight: "1px solid #2a2a3e", display: "flex", flexDirection: "column", padding: "20px" }}>
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: "bold", marginBottom: "30px" }}>
          🤖 AI Assistant
        </div>
        <button
          onClick={() => setMessages([{ role: "ai", content: "Hi! I'm your AI Business Assistant. Ask me anything!" }])}
          style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", cursor: "pointer", marginBottom: "10px" }}
        >
          + New Chat
        </button>
        <div style={{ color: "#666", fontSize: "12px", marginTop: "20px" }}>
          Powered by
        </div>
        <div style={{ color: "#888", fontSize: "11px", marginTop: "5px" }}>
          n8n + Groq + Tavily
        </div>
      </div>

      {/* Main Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #2a2a3e", color: "#fff", fontWeight: "bold", fontSize: "16px" }}>
          AI Business Assistant
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: "12px", alignItems: "flex-start" }}>
              
              {msg.role === "ai" && (
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                  🤖
                </div>
              )}

              <div style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.role === "user" ? "#4f46e5" : "#2a2a3e",
                color: "#fff",
                fontSize: "14px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap"
              }}>
                {msg.file && (
                  <div style={{ background: "#1a1a2e", borderRadius: "6px", padding: "8px", marginBottom: "8px", fontSize: "12px", color: "#888" }}>
                    📎 {msg.file}
                  </div>
                )}
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                  H
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>🤖</div>
              <div style={{ background: "#2a2a3e", padding: "12px 16px", borderRadius: "18px", color: "#888" }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Preview */}
        {fileName && (
          <div style={{ padding: "8px 24px", background: "#2a2a3e", color: "#888", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            📎 {fileName}
            <span onClick={() => { setFile(null); setFileName(""); }} style={{ cursor: "pointer", color: "#ef4444" }}>✕</span>
          </div>
        )}

        {/* Input */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #2a2a3e", display: "flex", gap: "12px", alignItems: "flex-end" }}>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
          />

          <button
            onClick={() => fileInputRef.current.click()}
            style={{ background: "#2a2a3e", border: "1px solid #3a3a4e", borderRadius: "8px", padding: "10px 12px", cursor: "pointer", color: "#888", fontSize: "18px" }}
          >
            📎
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message AI Assistant..."
            rows={1}
            style={{
              flex: 1, padding: "12px 16px", borderRadius: "12px", border: "1px solid #3a3a4e",
              background: "#2a2a3e", color: "#fff", fontSize: "14px", resize: "none", outline: "none",
              fontFamily: "Inter, sans-serif"
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            style={{ background: loading ? "#333" : "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 16px", cursor: loading ? "not-allowed" : "pointer", fontSize: "18px" }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;