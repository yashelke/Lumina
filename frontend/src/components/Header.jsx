import React from "react";
import { ChatData } from "../context/ChatContext";

const Header = () => {
  const { messages } = ChatData();

  return (
    <>
      <div>
        {messages && messages.length === 0 && (
          <>
            <p className="text-white text-lg mb-2">Welcome to Lumina</p>

            <p className="text-gray-400 text-sm font-light">Your AI-powered assistant.</p>
          </>
        )}
      </div>
    </>
  );
};

export default Header;
