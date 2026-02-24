import {Chat} from "../models/Chat.js";
import {Conversation} from "../models/Conversation.js";
import { Groq } from "groq-sdk";


// controller for creating new chat

export const createChat = async(req,res)=>
{
    try{
        const userId = req.user._id;

        const chat = await Chat.create({
            user:userId,
         });
         res.json(chat);


    }
    catch(error)
    {
        res.status(500).json({
            message : error.message,
        });
    }
}

// controller for getting all chats of a user

export const getAllChats = async(req,res)=>
{
    try{
        const chats = await Chat.find({user:req.user._id}).sort({
            createdAt : -1,

        });

        res.json(chats);

    }
    catch(error)
    {
        res.status(500).json({
            message : error.message,    
    });
  } 
}

// controller for conversations


export const addConversation = async(req,res) =>
{
    try{

        const chat = await Chat.findById(req.params.id);

        if(!chat) return res.status(404).json({
            message : "Chat not found.",
        })

        const {question, answer} = req.body;

        const conversation = await Conversation.create({
            chat: chat._id,
            question:req.body.question,
            answer:req.body.answer,
        });

        const updatedChat =await Chat.findByIdAndUpdate(req.params.id,{
            latestMessage : req.body.question,
        },{
            new:true,
        });



        res.json({conversation, updatedChat});

    }
    catch(error)
    {
        res.status(500).json({
            message : error.message,
        });
    }
}


// controller for getting all conversations of a chat

export const getConversation = async(req,res) =>
{
    try{
        const conversation = await Conversation.find({chat:req.params.id});

         if(!conversation || conversation.length === 0) return res.status(404).json({
            message : "No Conversations found with this chat id.",
        })


        res.json(conversation);
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message,
        }); 
    }
}

// controller for deleting a chat

export const deleteChat = async(req,res)=>
{
    try{
        const chat = await Chat.findById(req.params.id);

        if(!chat) return res.status(404).json({
            message : "Chat not found.",
        });

        if(chat.user.toString() !== req.user._id.toString()) return res.status(403).json({
            message : "Access Denied. You are not authorized to delete this chat.",
        });

        // Delete all conversations associated with this chat
        await Conversation.deleteMany({ chat: req.params.id });
        
        // Delete the chat
        await chat.deleteOne();

        res.status(200).json({
            message : "Chat deleted successfully.", 
        });

        
    }
    catch(error)
    {
        console.error("Delete chat error:", error);
        res.status(500).json({
            message : error.message,
        });
    }
}


// controller for updating chat (edit title, archive)

export const updateChat = async(req,res)=>
{
    try{
        const chat = await Chat.findById(req.params.id);

        if(!chat) return res.status(404).json({
            message : "Chat not found.",
        });

        if(chat.user.toString() !== req.user._id.toString()) return res.status(403).json({
            message : "Access Denied. You are not authorized to update this chat.",
        });

        const { title, archived } = req.body;

        if(title !== undefined) chat.title = title;
        if(archived !== undefined) chat.archived = archived;

        await chat.save();

        res.status(200).json({
            message : "Chat updated successfully.", 
            chat
        });

        
    }
    catch(error)
    {
        console.error("Update chat error:", error);
        res.status(500).json({
            message : error.message,
        });
    }
}


// controller for fetching response from Groq API

export const fetchAIResponse = async(req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                message: "Prompt is required"
            });
        }

        // Initialize Groq client
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        // Create chat completion (matching Postman configuration)
        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const answer = chatCompletion.choices[0]?.message?.content || "No response generated";

        res.json({
            question: prompt,
            answer: answer
        });

    } catch (error) {
        console.error("Groq API Error:", error.message);
        res.status(500).json({
            message: error.message || "Failed to fetch AI response"
        });
    }
}