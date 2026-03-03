import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiChatNewLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit, MdArchive, MdDelete, MdUnarchive } from "react-icons/md";
import { ChatData } from "../context/ChatContext";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

// Renders at document.body so it is never clipped by overflow:hidden/auto
const DropdownPortal = ({ anchorRef, onClose, children }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        left: rect.right - 160,
      });
    }
  }, [anchorRef]);

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 z-9998" onClick={onClose} />
      <div
        className="fixed z-9999 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-40"
        style={{ top: pos.top, left: Math.max(pos.left, 8) }}
      >
        {children}
      </div>
    </>,
    document.body
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const {
    chats,
    createNewChat,
    selectedChat,
    setSelectedChat,
    updateChatDetails,
    deleteChat,
    chatsLoading,
  } = ChatData();

  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  // Store a ref per chat button so DropdownPortal can read its screen position
  const menuBtnRefs = useRef({});

  const handleNewChat = () => createNewChat();

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (window.innerWidth < 768) toggleSidebar();
  };

  const toggleMenu = (chatId, e) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === chatId ? null : chatId));
  };

  const handleEditChat = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat._id);
    setEditTitle(chat.title);
    setOpenMenuId(null);
  };

  const handleSaveEdit = async (chatId, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      await updateChatDetails(chatId, { title: editTitle.trim() });
      setEditingChatId(null);
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleArchiveChat = async (chat, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    await updateChatDetails(chat._id, { archived: !chat.archived });
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    if (window.confirm("Are you sure you want to delete this chat?")) {
      await deleteChat(chatId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setUser(null);
    navigate("/login");
  };

  const gotoStudio =() =>
  {
    navigate("/studio");
  }

  const activeChats = chats.filter((chat) => !chat.archived);
  const archivedChats = chats.filter((chat) => chat.archived);
  const displayChats = showArchived ? archivedChats : activeChats;

  return (
    <>
      {/* Dark backdrop — mobile only, shown when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-gray-800 w-72 transition-transform transform
          md:relative md:inset-auto md:translate-x-0 md:w-1/4 md:h-full md:flex ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
      {/* ── Top: logo + new-chat + section header ── */}
      <div className="shrink-0 p-4">
        <button
          className="md:hidden p-2 mb-4 bg-gray-700 rounded"
          onClick={toggleSidebar}
        >
          <GiHamburgerMenu size={24} />
        </button>

        <div className="text-2xl font-semibold text-white mb-5">Lumina</div>

        <button
          onClick={handleNewChat}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-2xl flex items-center justify-center gap-2 transition-colors mb-4"
        >
          <RiChatNewLine size={20} />
          New Chat
        </button>

        <div className="flex items-center justify-between">
          <p className="text-sm text-white">
            {showArchived ? "Archived Chats" : "Recent Chats"}
          </p>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            {showArchived ? "Show Active" : `Archived (${archivedChats.length})`}
          </button>
        </div>
      </div>

      {/* ── Scrollable chat list ── flex-1 + min-h-0 is required for overflow to work */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4">
        {chatsLoading ? (
          <p className="text-center text-gray-400 py-4">Loading chats...</p>
        ) : displayChats.length === 0 ? (
          <p className="text-center text-white py-4">
            {showArchived ? "No archived chats" : "No chats yet"}
          </p>
        ) : (
          displayChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleSelectChat(chat)}
              className={`w-full mt-2 py-2 px-3 flex items-center justify-between cursor-pointer rounded-lg transition-colors ${
                selectedChat?._id === chat._id
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              {editingChatId === chat._id ? (
                <div
                  className="flex-1 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    autoFocus
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(chat._id, e);
                      if (e.key === "Escape") handleCancelEdit(e);
                    }}
                  />
                  <button
                    onClick={(e) => handleSaveEdit(chat._id, e)}
                    className="text-green-400 hover:text-green-300 text-xs px-1"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-red-400 hover:text-red-300 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {chat.title}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {chat.latestMessage}
                    </p>
                  </div>

                  {/* Button ref captured for portal positioning */}
                  <button
                    ref={(el) => (menuBtnRefs.current[chat._id] = el)}
                    onClick={(e) => toggleMenu(chat._id, e)}
                    className="shrink-0 ml-1 p-1 hover:bg-gray-600 rounded transition-colors"
                  >
                    <BsThreeDotsVertical size={16} />
                  </button>

                  {openMenuId === chat._id && (
                    <DropdownPortal
                      anchorRef={{ current: menuBtnRefs.current[chat._id] }}
                      onClose={() => setOpenMenuId(null)}
                    >
                      <button
                        onClick={(e) => handleEditChat(chat, e)}
                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-yellow-700 flex items-center gap-2 rounded-t-lg"
                      >
                        <MdEdit size={16} /> Edit Name
                      </button>
                      <button
                        onClick={(e) => handleArchiveChat(chat, e)}
                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                      >
                        {chat.archived ? (
                          <><MdUnarchive size={16} /> Unarchive</>
                        ) : (
                          <><MdArchive size={16} /> Archive</>
                        )}
                      </button>
                      <button
                        onClick={(e) => handleDeleteChat(chat._id, e)}
                        className="w-full px-4 py-2 text-left text-sm  hover:bg-gray-700 text-red-400 flex items-center gap-2 rounded-b-lg"
                      >
                        <MdDelete size={16} /> Delete
                      </button>
                    </DropdownPortal>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* LuminaStudio - a feature to be implemented later on */}

      <div className="shrink-0 p-4 mt-4">
        <button onClick={gotoStudio} className="text-white w-full bg-violet-600 py-2 rounded-md hover:text-yellow-400 transition-colors">✨LuminaStudio</button>
      </div>

      {/* ── Logout ── */}
      <div className="shrink-0 p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
