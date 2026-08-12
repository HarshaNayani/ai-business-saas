import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!query) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/ask?query=${encodeURIComponent(query)}`,
        { method: "POST" }
      );
      const data = await res.json();
      setAnswer(data.answer.output);
    } catch (err) {
      setAnswer("Error occurred. Try again!");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f1a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <h1 style={{ color: "#fff", fontSize: "2rem", marginBottom: "10px" }}>
        🤖 AI Business Assistant
      </h1>
      <p style={{ color: "#888", marginBottom: "30px" }}>
        Powered by n8n + Groq + Tavily
      </p>

      <div style={{ width: "100%", maxWidth: "600px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && askQuestion()}
          placeholder="Ask anything..."
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#1a1a2e",
            color: "#fff",
            fontSize: "1rem",
            marginBottom: "10px",
            boxSizing: "border-box"
          }}
        />
        <button
          onClick={askQuestion}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            border: "none",
            background: loading ? "#333" : "#4f46e5",
            color: "#fff",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "20px"
          }}
        >
          {loading ? "Thinking..." : "Ask AI 🚀"}
        </button>

        {answer && (
          <div style={{
            background: "#1a1a2e",
            border: "1px solid #333",
            borderRadius: "10px",
            padding: "20px",
            color: "#fff",
            lineHeight: "1.6"
          }}>
            <p style={{ color: "#4f46e5", marginBottom: "10px" }}>
              AI Answer:
            </p>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;