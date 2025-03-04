import { useState, useEffect } from 'react';
import './Chat.css';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import endpoints from '../services/api';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Chat() {
  const { user, logout } = useAuth();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('typing', ({ userId, typing }) => {
      if (selectedUser?.id === userId) {
        setIsTyping(typing);
      }
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(endpoints.users.getAll());
        if (response.ok) {
          const data = await response.json();
          setUsers(data.filter(u => u.id !== user.id));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          const response = await fetch(
            endpoints.messages.getAll(user.id, selectedUser.id)
          );
          if (response.ok) {
            const data = await response.json();
            setMessages(data);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();
  }, [selectedUser, user.id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser) {
      try {
        const response = await fetch(endpoints.messages.create(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderId: user.id,
            recipientId: selectedUser.id,
            content: message
          }),
        });

        if (response.ok) {
          const newMessage = await response.json();
          setMessages(prev => [...prev, newMessage]);
          setMessage('');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chat-container">
      {/* Users sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="flex items-center justify-between">
            <span className="username">{user.username}</span>
            <button
              onClick={logout}
              className="logout-button"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="user-list">
          {users.map(u => (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`user-item ${selectedUser?.id === u.id ? 'active' : ''}`}
            >
              {u.username}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="chat-area">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <h2 className="chat-username">{selectedUser.username}</h2>
              {isTyping && (
                <div className="typing-indicator">typing...</div>
              )}
            </div>
            <div className="message-list">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-item ${msg.senderId === user.id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="message-form">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    socket.emit('typing', {
                      recipientId: selectedUser.id,
                      typing: e.target.value.length > 0
                    });
                  }}
                  className="message-input"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="send-button"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
} 