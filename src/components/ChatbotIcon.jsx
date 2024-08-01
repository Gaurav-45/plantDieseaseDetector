import React, { useState } from "react";
import Chatbot from "../pages/Chatbot";

const ChatbotIcon = () => {
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const toggleChatbotVisibility = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  return (
    <div>
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          backgroundColor: "#07af5e",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          fontSize: "24px",
          cursor: "pointer",
        }}
        onClick={toggleChatbotVisibility}
      >
        {isChatbotVisible ? "✕" : "💬"}
      </button>
      {isChatbotVisible && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            height: "400px",
            zIndex: 999,
            border: "1px solid #ccc",
            borderRadius: "10px",
            overflow: "hidden",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default ChatbotIcon;
