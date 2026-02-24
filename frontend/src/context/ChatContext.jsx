import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);
  
  // Chat management state
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatsLoading, setChatsLoading] = useState(false);

  // Fetch all chats
  async function fetchChats() {
    setChatsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/chat/all", {
        headers: {
          token: localStorage.getItem("token")
        }
      });
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setChatsLoading(false);
    }
  }

  // Create new chat
  async function createNewChat() {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat/new",
        {},
        {
          headers: {
            token: localStorage.getItem("token")
          }
        }
      );
      setChats((prev) => [response.data, ...prev]);
      setSelectedChat(response.data);
      setMessages([]);
      return response.data;
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create new chat");
    }
  }

  // Fetch conversations for a specific chat
  async function fetchConversations(chatId) {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/${chatId}`,
        {
          headers: {
            token: localStorage.getItem("token")
          }
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      if (error.response?.status === 404) {
        // No conversations yet for this chat
        setMessages([]);
      }
    }
  }

  // Update chat (edit title or archive)
  async function updateChatDetails(chatId, updates) {
    try {
      console.log('Updating chat:', chatId, updates);
      const response = await axios.put(
        `http://localhost:5000/api/chat/${chatId}`,
        updates,
        {
          headers: {
            token: localStorage.getItem("token")
          }
        }
      );
      
      console.log('Update response:', response.data);
      
      // Update chat in local state
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId ? response.data.chat : chat
        )
      );
      
      if (selectedChat?._id === chatId) {
        setSelectedChat(response.data.chat);
      }
      
      return response.data.chat;
    } catch (error) {
      console.error("Error updating chat:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to update chat");
    }
  }

  // Delete chat
  async function deleteChat(chatId) {
    try {
      console.log('Deleting chat:', chatId);
      await axios.delete(`http://localhost:5000/api/chat/${chatId}`, {
        headers: {
          token: localStorage.getItem("token")
        }
      });
      
      console.log('Chat deleted successfully');
      
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
      
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting chat:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete chat");
    }
  }

  // Fetch response and save conversation
  async function fetchResponse() {
    if (prompt === "") return alert("Please enter a prompt");

    // Create a new chat if none is selected
    let currentChat = selectedChat;
    if (!currentChat) {
      currentChat = await createNewChat();
      if (!currentChat) return; // Failed to create chat
    }

    const userPrompt = prompt;
    setPrompt("");

    // Add user message immediately
    const userMessage = {
      question: userPrompt,
      answer: null // No answer yet
    };
    setMessages((prev) => [...prev, userMessage]);

    setNewRequestLoading(true);

    try {
      // Get AI response
      const aiResponse = await axios.post(
        "http://localhost:5000/api/chat/ai",
        { prompt: userPrompt },
        {
          headers: {
            token: localStorage.getItem("token")
          }
        }
      );

      const answer = aiResponse.data.answer;

      // Save conversation to database
      await axios.post(
        `http://localhost:5000/api/chat/${currentChat._id}`,
        {
          question: userPrompt,
          answer: answer
        },
        {
          headers: {
            token: localStorage.getItem("token")
          }
        }
      );

      // Update the last message with the answer
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].answer = answer;
        return updated;
      });

      // Update chat list with latest message
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === currentChat._id
            ? { ...chat, latestMessage: userPrompt }
            : chat
        )
      );

      setNewRequestLoading(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while fetching the response. Please try again.";
      alert(errorMessage);

      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
      setNewRequestLoading(false);
      setPrompt(userPrompt); // Restore prompt on error
    }
  }

  // Load chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Load conversations when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchConversations(selectedChat._id);
    }
  }, [selectedChat]);

  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        prompt,
        setPrompt,
        messages,
        newRequestLoading,
        chats,
        selectedChat,
        setSelectedChat,
        createNewChat,
        updateChatDetails,
        deleteChat,
        chatsLoading,
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);
