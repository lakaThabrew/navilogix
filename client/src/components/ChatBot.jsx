import React, { useState, useEffect } from "react";
import axios from "axios";
import logger from "../utils/logger";

const ChatBot = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpenChatBot = () => {
      setOpen(true);
    };

    window.addEventListener("openChatBot", handleOpenChatBot);

    return () => {
      window.removeEventListener("openChatBot", handleOpenChatBot);
    };
  }, []);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I am your AI assistant. Ask me about your parcel.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;
    logger.info("🤖 [CLIENT CHATBOT] User message: " + input);
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Call backend API
    try {
      setMessages([...newMessages, { sender: "bot", text: "..." }]); // Loading state

      const response = await axios.post("http://localhost:5000/api/ai/chat", {
        message: input,
      });
      const botResponse = response.data.reply;

      setMessages([...newMessages, { sender: "bot", text: botResponse }]);
    } catch (error) {
      logger.error("Error sending message to chatbot: " + error.message, { error });
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: "Sorry, I'm having trouble connecting to the server.",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="floating-card w-[calc(100vw-3rem)] sm:w-80 h-96 flex flex-col mb-4 p-0 overflow-hidden shadow-2xl animate-fade-in-up">
          <div className="bg-primary p-4 text-white font-bold flex justify-between items-center rounded-t-[20px]">
            <span>AI Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-secondary text-xl"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${m.sender === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex">
            <input
              className="flex-1 p-2 bg-gray-100 rounded-l-xl outline-none text-sm"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && send()}
            />
            <button
              className="bg-secondary text-white px-4 py-2 rounded-r-xl font-bold hover:bg-red-600 transition-colors"
              onClick={send}
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        className="w-16 h-16 bg-primary text-white rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-secondary hover:scale-110 transition-all duration-300 overflow-hidden group"
        onClick={() => setOpen(!open)}
      >
        <img
          src="/ai_icon.png"
          alt="AI Chat"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </button>
    </div>
  );
};
export default ChatBot;
