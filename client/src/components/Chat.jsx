import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in first");

    // Connect to Socket.IO server with auth token
    const s = io("http://localhost:5500", {
      auth: { token },
    });

    setSocket(s);

    s.on("connect", () => console.debug("socket connected", s.id));
    s.on("connect_error", (err) => console.error("socket connect_error", err));

    // Listen for server messages
    s.on("serverMessage", (msg) => {
      setMessages((prev) => [
        ...prev,
        { user: "Server", message: msg, time: new Date().toLocaleTimeString() },
      ]);
    });

    // Listen for chat messages from other users
    s.on("chatMessage", (data) => {
      const normalized =
        typeof data === "string"
          ? { user: "User", message: data }
          : data || {};

      setMessages((prev) => [
        ...prev,
        {
          user: normalized.user || "User",
          message: normalized.message || "",
          time: normalized.time || new Date().toLocaleTimeString(),
        },
      ]);
    });

    // Cleanup on unmount
    return () => {
      s.off("serverMessage");
      s.off("chatMessage");
      s.disconnect();
    };
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const messageText = text.trim();

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      { user: "You", message: messageText, time: new Date().toLocaleTimeString() },
    ]);
    setText("");

    if (!socket) {
      console.warn("No socket available — message added locally");
      return;
    }

    socket.emit("chatMessage", messageText);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Group Chat</h2>

      <div style={styles.chatBox} ref={chatBoxRef}>
        {messages.map((msg, i) => {
          const isMine = msg.user === "You";
          return (
            <div
              key={i}
              style={{
                ...styles.messageWrapper,
                justifyContent: isMine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  ...(isMine ? styles.myMessage : styles.otherMessage),
                }}
              >
                <div style={styles.messageHeader}>
                  <strong style={styles.userName}>
                    {isMine ? "You" : msg.user}
                  </strong>
                  <span style={styles.time}>{msg.time || ""}</span>
                </div>
                <div style={styles.messageText}>{msg.message}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "30px auto",
    padding: "16px",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#222",
  },
  header: {
    margin: "0 0 12px 0",
    fontSize: "1.25rem",
    color: "#111",
  },
  chatBox: {
    height: "480px",
    overflowY: "auto",
    border: "1px solid #e6e6e6",
    padding: "12px",
    marginBottom: "12px",
    backgroundColor: "#f7fafc",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  messageWrapper: {
    display: "flex",
    width: "100%",
    padding: "2px 6px",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: "10px 12px",
    borderRadius: "12px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    wordBreak: "break-word",
  },
  myMessage: {
    backgroundColor: "#0078d4",
    color: "#fff",
    borderTopRightRadius: "4px",
    textAlign: "right",
  },
  otherMessage: {
    backgroundColor: "#e9eef8",
    color: "#0b2545",
    borderTopLeftRadius: "4px",
    textAlign: "left",
  },
  messageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    marginBottom: "6px",
  },
  userName: {
    fontSize: "0.95rem",
  },
  messageText: {
    fontSize: "1rem",
    lineHeight: "1.4",
  },
  inputArea: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccd7e6",
    outline: "none",
  },
  button: {
    padding: "10px 16px",
    fontSize: "1rem",
    borderRadius: "8px",
    backgroundColor: "#0063b1",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  time: {
    color: "rgba(0,0,0,0.45)",
    fontSize: "0.78rem",
    marginLeft: "8px",
  },
};

export default Chat;
