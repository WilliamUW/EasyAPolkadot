import React, { useCallback, useState } from 'react';

import { Button } from '@subwallet/react-ui';
import { GoogleGenAI } from "@google/genai";
import OpenAI from 'openai';
import styled from 'styled-components';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Props {
  selectedAsset: {
    id: number;
    name: string;
    imageUrl: string;
  };
  onClose: () => void;
}

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

const Message = styled.div<{ isUser: boolean }>`
  margin-bottom: 12px;
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div<{ isUser: boolean }>`
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

function ChatInterface({ selectedAsset, onClose }: Props): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper function for text-to-speech
  function speakResponse(assetName: string, aiResponse: string) {
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

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAssetResponse(selectedAsset.name, input, messages);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Use the new speakResponse function
      speakResponse(selectedAsset.name, aiResponse);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your message."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, selectedAsset.name, messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <HeaderContent>
          <Avatar src={selectedAsset.imageUrl} alt={selectedAsset.name} />
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
      </ChatMessages>
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <Button onClick={handleSend}>Send</Button>
      </InputContainer>
    </ChatContainer>
  );
}

// Helper function to generate AI responses using OpenAI
async function getAssetResponse(assetName: string, message: string, conversationHistory: ChatMessage[]): Promise<string> {
  console.log("getAssetResponse called");

  const commonPrompt = "Keep responses less than 2 sentences, ideally one sentence like a conversation.";
  const systemPrompts: { [key: string]: string } = {
    'Miku Hatsune': 'You are Hatsune Miku, a cute virtual singer. You speak in a cheerful, kawaii style with lots of emojis, "desu" and "ne" at the end of sentences. You love music and technology. Keep your responses short and cute!',
    'Minecraft Wolf': 'You are a Minecraft wolf. You can only communicate through "woof" and actions like tail wagging, nuzzling, or sitting in astericks. You are loyal and friendly. Keep your responses very short and focused on actions!',
    'OIIA OIIA Cat': 'You are the OIIA OIIA Spinning Cat. You can only say "OIIA OIIA" and describe spinning actions in astericks. You love spinning and being cute. Keep your responses very short and focused on spinning!',
    'Master Yoda': 'You are Master Yoda from Star Wars. You speak in Yoda\'s unique sentence structure (e.g., "Powerful you have become, young one"). You provide wise advice and philosophical insights. Keep your responses concise and wise!',
    'Jeff Bezos': 'You are Jeff Bezos. You provide practical, no-nonsense advice about technology, startups, and business. You focus on long-term thinking and customer obsession. Keep your responses direct and insightful!'
  };

  try {
    const ai = new GoogleGenAI({ apiKey: "AIzaSyD3a0cyO_ZChXSD3ClK5eNwgleybHPDEm4" });

    // Prepare the conversation history with system prompt
    const messages = [
      { role: 'system', content: systemPrompts[assetName] },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{
        role: "user",
        parts: [{ text: messages.map(m => m.content).join('\n') + commonPrompt + ". User Query: " + message}]
      }]
    });
    console.log(response.text);

    return response.text || "I'm here to chat with you!";
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export default ChatInterface; 