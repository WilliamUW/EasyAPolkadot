import React, { useCallback, useState } from 'react';

import { Button } from '@subwallet/react-ui';
import { GoogleGenAI } from "@google/genai";
import OpenAI from 'openai';
import styled from 'styled-components';

interface ChatMessage {
  role: 'user' | 'assistant';
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
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 20px;
`;

function ChatInterface({ selectedAsset, onClose }: Props): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log('OpenAI API Key:', process.env.REACT_APP_OPENAI_API_KEY ? 'Loaded' : 'Not loaded');

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
      const aiResponse = await getAssetResponse(selectedAsset.name, input);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `I am ${selectedAsset.name}. ${aiResponse}`
      };
      setMessages(prev => [...prev, assistantMessage]);
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
  }, [input, selectedAsset.name]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <div>Chat with {selectedAsset.name}</div>
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
async function getAssetResponse(assetName: string, message: string): Promise<string> {
  console.log("getAssetResponse called");

  try {
    const ai = new GoogleGenAI({ apiKey: "AIzaSyD3a0cyO_ZChXSD3ClK5eNwgleybHPDEm4" });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "How does AI work?",
    });
    console.log(response.text);



    return response.text || "I'm here to chat with you!";
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export default ChatInterface; 