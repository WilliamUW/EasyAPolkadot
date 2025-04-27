'use client';

import React, { useCallback, useState } from 'react';

import { GoogleGenAI } from "@google/genai";
import styled from 'styled-components';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 12px;
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  background: ${props => props.isUser ? '#007bff' : '#f0f0f0'};
  color: ${props => props.isUser ? 'white' : 'black'};
`;

const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  color: black;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 20px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
`;

const ChatInterface = ({ selectedAsset, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper function for text-to-speech
  function speakResponse(assetName, aiResponse) {
    const speech = new SpeechSynthesisUtterance(aiResponse);
    const voices = window.speechSynthesis.getVoices();
    
    switch(assetName) {
      case 'Miku Hatsune':
        speech.voice = voices.find(v => v.lang.includes('ja')) || voices[0];
        speech.rate = 1.2;
        break;
      case 'Master Yoda':
        speech.rate = 0.8;
        break;
      case 'Jeff Bezos':
        speech.rate = 1.1;
        break;
      default:
        speech.rate = 1.0;
    }
    
    window.speechSynthesis.speak(speech);
  }

  const getAssetResponse = async (message, conversationHistory) => {
    const commonPrompt = "Keep responses less than 2 sentences, ideally one sentence like a conversation.";
    const systemPrompt = `You are "${selectedAsset.name}". 
   Prompt: "${selectedAsset.description}".`;

    try {
      const ai = new GoogleGenAI({ apiKey:process.env.NEXT_PUBLIC_GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{
          role: "user",
          parts: [{ text: systemPrompt + commonPrompt + ". Conversation History: " + conversationHistory.map(m => m.content).join('\n') + ". User Query: " + message}]
        }]
      });
      console.log(response.text);
      return response.text;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  };

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAssetResponse(input, messages);
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Use the speakResponse function
      speakResponse(selectedAsset.name, aiResponse);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your message."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, selectedAsset]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <HeaderContent>
          <Avatar src={selectedAsset.thumbnailUrl} alt={selectedAsset.name} />
          <div>Chat with {selectedAsset.name}</div>
        </HeaderContent>
        <CloseButton onClick={onClose}>×</CloseButton>
      </ChatHeader>
      <ChatMessages>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.role === 'user'}>
            <MessageContent isUser={message.role === 'user'}>
              {message.content}
            </MessageContent>
          </Message>
        ))}
        {isLoading && (
          <Message isUser={false}>
            <MessageContent isUser={false}>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                Thinking...
              </div>
            </MessageContent>
          </Message>
        )}
      </ChatMessages>
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Send
        </button>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterface; 