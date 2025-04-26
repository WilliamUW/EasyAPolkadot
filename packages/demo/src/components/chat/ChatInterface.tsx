import React, { useCallback, useState } from 'react';

import { Button } from '@subwallet/react-ui';
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

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: `I am ${selectedAsset.name}. ${getAssetResponse(selectedAsset.name, input)}`
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
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

// Helper function to generate AI responses based on the asset
function getAssetResponse(assetName: string, message: string): string {
  const responses: Record<string, string> = {
    'Master Yoda': 'May the Force be with you! I sense great potential in your question.',
    'Minecraft Wolf': 'Woof! I love exploring the blocky world and hunting for bones.',
    'Miku Hatsune': 'Konichiwa! I love singing and dancing for my fans.',
    'Jeff Bezos': "I'm focused on building the future of space exploration.",
    'OIIA OIIA Cat': "Meow! I'm a playful cat who loves to explore and nap."
  };

  return responses[assetName] || 'I am here to chat with you!';
}

export default ChatInterface; 