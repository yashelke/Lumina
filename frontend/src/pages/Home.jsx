import React, { useState } from 'react'
import Sidebar from '../components/Sidebar';
import { GiHamburgerMenu } from "react-icons/gi";
import Header from '../components/Header';
import { ChatData } from '../context/ChatContext';
import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { LoadingSmall } from '../components/Loading';
import { IoIosSend } from "react-icons/io";
import {useTypewriter, Cursor} from "react-simple-typewriter";

const Home = () => {

  // get user email fro LocalStorage to display the user email who is loggedin in the chatbot in the header section.

  const user = localStorage.getItem("email") || "User";

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () =>{
    setIsOpen(!isOpen);
  }


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
                      <div className="flex-shrink-0 bg-white p-1.5 md:p-2 rounded-full text-black text-lg md:text-xl w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                        <CgProfile />
                      </div>
                    </div>

                    {/* AI Response - Left Side */}
                    {message.answer ? (
                      <div className='flex items-start gap-2 md:gap-3'>
                        <div className="flex-shrink-0 bg-white p-1.5 md:p-2 rounded-full text-black text-lg md:text-xl w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                          <FaRobot />
                        </div>
                        <div className="flex-1 max-w-[85%] md:max-w-[70%]">
                          <div className="p-3 md:p-4 rounded-lg bg-gray-800">
                            <p className="text-white text-sm md:text-base break-words" dangerouslySetInnerHTML={{__html: message.answer}}></p>
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