import React, { useState, useEffect, useRef } from 'react';
import type { IAgoraRTCClient, UID } from 'agora-rtc-sdk-ng';

interface ChatPanelProps {
  client: IAgoraRTCClient;
  streamId: number | null; // This is the Data Stream ID
  userName: string;
  onClose: () => void;
}

type Message = {
  user: string;
  type: 'text' | 'file';
  text?: string;
  fileName?: string;
  fileType?: string; // Added for proper file handling on receiver side
  data?: string; // For DataURL of files
  timestamp: number; // Added for ordering
};

const ChatPanel: React.FC<ChatPanelProps> = ({ client, streamId, userName, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (streamId !== null && client) {
      const handleStreamMessage = (uid: UID, payload: Uint8Array, eventStreamId: number) => {
        if (eventStreamId !== streamId) return; // Filter messages for this specific stream
        try {
          const textDecoder = new TextDecoder();
          const decodedMsg = textDecoder.decode(payload);
          const msgObj: Message = JSON.parse(decodedMsg);

          // Ensure timestamp exists, though sender should always include it
          if (typeof msgObj.timestamp !== 'number') {
            (msgObj as any).timestamp = Date.now(); 
          }
          
          setMessages(prev => [...prev, msgObj].sort((a, b) => a.timestamp - b.timestamp));
        } catch (error) {
            console.error("Failed to parse stream message or update state:", error);
        }
      };
      
      // Type assertion for client methods if not fully typed by IAgoraRTCClient for stream messages
      (client as any).on('stream-message', handleStreamMessage);
      
      return () => {
        (client as any).off('stream-message', handleStreamMessage);
      };
    }
  }, [client, streamId]); // streamId is crucial here

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    scrollToBottom();
    // Removed incorrect cleanup for 'stream-message' from here
  }, [messages]);

  const sendText = async () => {
    if (!input.trim() || streamId === null) return;
    const msg: Message = { 
      user: userName, 
      type: 'text', 
      text: input.trim(), 
      timestamp: Date.now() 
    };
    try {
      const payload = new TextEncoder().encode(JSON.stringify(msg));
      await (client as any).sendStreamMessage(payload, streamId); // Corrected arguments and payload type
      setMessages(prev => [...prev, msg].sort((a, b) => a.timestamp - b.timestamp));
      setInput('');
    } catch (error) {
      console.error("Failed to send text message:", error);
    }
  };

  const sendFile = () => {
    const file = fileRef.current?.files?.[0];
    if (!file || streamId === null) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const msg: Message = { 
        user: userName, 
        type: 'file', 
        fileName: file.name, 
        fileType: file.type,
        data: dataUrl, 
        timestamp: Date.now() 
      };
      try {
        const payload = new TextEncoder().encode(JSON.stringify(msg));
        await (client as any).sendStreamMessage(payload, streamId); // Corrected arguments and payload type
        setMessages(prev => [...prev, msg].sort((a, b) => a.timestamp - b.timestamp));
        if(fileRef.current) fileRef.current.value = ""; // Reset file input
      } catch (error) {
        console.error("Failed to send file message:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg flex flex-col z-50">
      <div className="p-3 bg-gray-100 border-b border-gray-300 flex justify-between items-center">
        <span className="font-semibold text-gray-700">Chat</span>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-red-600 transition-colors text-xl"
          aria-label="Close chat"
        >
          &times;
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((m) => ( // Changed key to m.timestamp + m.user for better uniqueness
          <div 
            key={`${m.timestamp}-${m.user}-${m.text ? m.text.slice(0,5) : m.fileName}`} 
            className={`flex flex-col ${m.user === userName ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-xs p-2 rounded-lg shadow ${
                m.user === userName 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <strong className="text-sm block mb-0.5">{m.user === userName ? 'You' : m.user}</strong>
              {m.type === 'text' ? (
                <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>
              ) : (
                <a 
                  href={m.data} 
                  download={m.fileName} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-sm underline ${
                    m.user === userName ? 'hover:text-blue-200' : 'text-indigo-600 hover:text-indigo-800'
                  }`}
                >
                  {m.fileName} ({m.fileType})
                </a>
              )}
              <div className={`text-xs mt-1 ${m.user === userName ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-gray-300 bg-gray-100">
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendText()}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type a message..."
          />
          <button 
            onClick={sendText} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            disabled={!input.trim() || streamId === null}
          >
            Send
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="chat-file-input" className="sr-only">Choose file</label>
          <input 
            id="chat-file-input" 
            type="file" 
            ref={fileRef} 
            onChange={sendFile} // Send file immediately on change
            aria-label="Select file" 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
          />
          {/* Removed separate upload button, file sends on selection */}
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
