import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar';
import { GiHamburgerMenu } from "react-icons/gi";
import Header from '../components/Header';
import { ChatData } from '../context/ChatContext';
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { SlLike, SlDislike } from "react-icons/sl";
import { LoadingSmall } from '../components/Loading';
import { IoIosSend } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";

import {useTypewriter, Cursor} from "react-simple-typewriter";
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const Home = () => {

  // get user email fro LocalStorage to display the user email who is loggedin in the chatbot in the header section.

  const user = localStorage.getItem("email") || "User";

  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});

  const handleFeedback = (index, type) => {
    const current = feedbacks[index];
    const next = current === type ? null : type;
    setFeedbacks(prev => ({ ...prev, [index]: next }));
    if (next === 'like') {
      // toast.success('Thanks for the feedback!', { icon: '👍', id: 'feedback' });
      toast.success("👍 Thanks for the feedback!")
    } else if (next === 'dislike') {
      // toast.error("Sorry to hear that! We'll improve.", { icon: '👎', id: 'feedback' });
      toast.error("Sorry to hear that! We'll improve.")
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("✅ Response copied to clipboard!");
    } catch (error) {
      toast.error("❌ Failed to copy response");
      console.error('Copy failed:', error);
    }
  };

  const toggleSidebar = () =>{
    setIsOpen(!isOpen);
  }

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const {fetchResponse, messages, prompt, setPrompt, newRequestLoading, selectedChat } = ChatData();

  const handleSubmit = (e) =>{

    e.preventDefault();

    fetchResponse();
  }

  // Implementing typewriter effect in messages container.

  const [ text ] = useTypewriter({
    words:["Hello, How can I assist you today?", "What would you like to learn about?", "Explore LuminaStudio - Your AI Image Generator!"],
    loop: 0,
    typeSpeed: 60,
    deleteSpeed: 35,
    delaySpeed: 1800,
  });


  return (
    <>
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col h-screen">
        {/* Hamburger menu */}
        <button className="md:hidden p-4 bg-gray-800 text-2xl" onClick={toggleSidebar}>
          <GiHamburgerMenu size={24} />
        </button>

        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <Header />
          {selectedChat && (
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-400">Current Chat: <span className="text-white font-medium">{selectedChat.title}</span></p>
            </div>

          
          )}

            {/*  display user email on right corner of header */}
            <div className="absolute top-4 right-4">
              <h2 className="text-semibold text-white">Welcome: <em>{user}</em></h2>
            </div>
        
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-2 md:p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            {
              messages && messages.length > 0 ? (
                messages.map((message, index) => (
                  <div key={index} className="space-y-3">
                    {/* User Message - Right Side */}
                    <div className='flex items-start gap-2 md:gap-3 justify-end'>
                      <div className="flex-1 max-w-[85%] md:max-w-[70%]">
                        <div className="p-3 md:p-4 rounded-lg bg-blue-600">
                          <p className="text-white text-sm md:text-base break-words">{message.question}</p>
                        </div>
                      </div>
                      <div className="relative profile-dropdown-container flex-shrink-0">
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="bg-white p-1.5 md:p-2 rounded-full text-black text-lg md:text-xl w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <CgProfile />
                        </button>
                        {openDropdown === index && (
                          <div className="absolute right-0 top-full mt-1 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                            <button
                              className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-gray-700 hover:text-blue-600 transition-colors"
                              onClick={() => {
                                // Edit functionality will be wired later
                                setOpenDropdown(null);
                              }}
                            >
                               ✨  Edit Prompt
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Response - Left Side */}
                    {message.answer ? (
                      <div className='flex items-start gap-2 md:gap-3'>
                        <div className="flex-shrink-0 bg-white p-1.5 md:p-2 rounded-full text-black text-lg md:text-xl w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                          <FaRobot />
                        </div>
                        <div className="flex-1 max-w-[85%] md:max-w-[70%]">
                          <div className="p-3 md:p-4 rounded-lg bg-gray-800 text-sm md:text-base text-white">
                            <ReactMarkdown
                              components={{
                                p: ({children}) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                                strong: ({children}) => <strong className="font-semibold text-blue-300">{children}</strong>,
                                em: ({children}) => <em className="italic text-gray-300">{children}</em>,
                                ul: ({children}) => <ul className="list-disc list-inside space-y-1 my-2 pl-2">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal list-inside space-y-1 my-2 pl-2">{children}</ol>,
                                li: ({children}) => <li className="leading-relaxed">{children}</li>,
                                h1: ({children}) => <h1 className="text-lg font-bold text-white mt-3 mb-1">{children}</h1>,
                                h2: ({children}) => <h2 className="text-base font-bold text-white mt-3 mb-1">{children}</h2>,
                                h3: ({children}) => <h3 className="text-sm font-semibold text-white mt-2 mb-1">{children}</h3>,
                                code: ({inline, children}) => inline
                                  ? <code className="bg-gray-700 text-blue-300 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                                  : <pre className="bg-gray-700 rounded p-3 my-2 overflow-x-auto text-xs font-mono text-gray-200 whitespace-pre-wrap"><code>{children}</code></pre>,
                                blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-3 my-2 text-gray-300 italic">{children}</blockquote>,
                                hr: () => <hr className="border-gray-600 my-3" />,
                              }}
                            >
                              {message.answer}
                            </ReactMarkdown>
                          </div>

                          {/* Like / Dislike row */}
                          <div className="flex items-center gap-3 mt-2 pl-1">
                            {/* Like */}
                            <figure className="relative group">
                              <button
                                onClick={() => handleFeedback(index, 'like')}
                                className={`p-1.5 md:p-2 rounded-md transition-colors ${
                                  feedbacks[index] === 'like'
                                    ? 'text-green-400 bg-green-400/10'
                                    : 'text-gray-400 hover:text-green-400 hover:bg-green-400/10'
                                }`}
                              >
                                <SlLike size={15} className="md:w-4 md:h-4" />
                              </button>
                              <figcaption className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                                Like response
                              </figcaption>
                            </figure>

                            {/* Dislike */}
                            <figure className="relative group">
                              <button
                                onClick={() => handleFeedback(index, 'dislike')}
                                className={`p-1.5 md:p-2 rounded-md transition-colors ${
                                  feedbacks[index] === 'dislike'
                                    ? 'text-red-400 bg-red-400/10'
                                    : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
                                }`}
                              >
                                <SlDislike size={15} className="md:w-4 md:h-4" />
                              </button>
                              <figcaption className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                                Dislike response
                              </figcaption>
                            </figure>

                            {/* Copy response */}

                            <figure className="relative group">
                              <button onClick={() => copyToClipboard(message.answer)} className="p-1.5 md:p-2 rounded-md text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
                                <MdContentCopy size={15} className="md:w-4 md:h-4" />
                              </button>
                              <figcaption className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                                Copy response
                              </figcaption>
                            </figure>


                          </div>
                        </div>
                      </div>
                    ) : (
                      newRequestLoading && index === messages.length - 1 && (
                        <div className='flex items-start gap-2 md:gap-3'>
                          <div className="flex-shrink-0 bg-white p-1.5 md:p-2 rounded-full text-black text-lg md:text-xl w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                            <FaRobot />
                          </div>
                          <div className="flex items-center p-3 md:p-4">
                            <LoadingSmall/>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-white font-semibold text-base md:text-lg text-center px-4"><em>{text}<Cursor cursorStyle="|" cursorColor="#60a5fa" /></em></span>
                </div>
              )
            }
          </div>
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-800 p-2 md:p-4 bg-gray-900">
          <form onSubmit={handleSubmit} className='flex items-center gap-2 md:gap-3 max-w-4xl mx-auto'>
            <input 
              className="flex-1 p-3 md:p-4 bg-gray-800 rounded-lg text-white text-sm md:text-base placeholder-gray-500 outline-none border border-gray-700 focus:border-blue-500 transition-colors"
              type="text"
              placeholder="Enter a prompt here"
              value={prompt}
              onChange={(e)=> setPrompt(e.target.value)}
              required
            />

            <button 
              type="submit" 
              className="p-3 md:p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={!prompt.trim() || newRequestLoading}
            >
              <IoIosSend size={20} className="md:w-6 md:h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home;