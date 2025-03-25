import React, { useState, useEffect } from 'react';
import './styles/Chat.css';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import endpoints from '../services/api';
import Navigation from '../components/Navigation';

export default function Chat() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('message', (newMessage) => {
      if (newMessage) {
        console.log('Received socket message:', newMessage);
        setMessages(prev => Array.isArray(prev) ? [...prev, newMessage] : [newMessage]);
      }
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
        setError(null);
        const response = await fetch(endpoints.users.getAll(), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.filter(u => u.id !== user?.id));
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser && user) {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch(
            endpoints.messages.getConversation(selectedUser.id),
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          if (response.ok) {
            const data = await response.json();
            setMessages(Array.isArray(data) ? data : []);
          } else {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to fetch messages');
            setMessages([]);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
          setError('Failed to fetch messages');
          setMessages([]);
        } finally {
          setLoading(false);
        }
      } else {
        setMessages([]);
      }
    };

    fetchMessages();
  }, [selectedUser, user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser && user) {
      try {
        setError(null);
        console.log('Sending message to endpoint:', endpoints.messages.send());
        const response = await fetch(endpoints.messages.send(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            receiverId: selectedUser.id,
            content: message
          }),
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response body:', responseText);

        if (response.ok) {
          const responseData = JSON.parse(responseText);
          const newMessage = responseData.data;  // Extract the actual message data
          console.log('New message from server:', newMessage);
          setMessages(prev => Array.isArray(prev) ? [...prev, newMessage] : [newMessage]);
          setMessage('');
          
          // Emit the message through socket with complete data
          socket?.emit('message', {
            id: newMessage.id,
            senderId: user.id,
            receiverId: selectedUser.id,
            content: newMessage.content,
            createdAt: newMessage.createdAt,
            sender: { id: user.id, username: user.username },
            recipient: { id: selectedUser.id, username: selectedUser.username }
          });
        } else {
          setError(responseText.message || 'Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message');
      }
    }
  };

  return (
    <div className="chat-container">
      <Navigation />
      <div className="chat-content">
        {/* Users sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="flex items-center justify-between">
              <span className="username">{user?.username}</span>
            </div>
          </div>
          <div className="user-list">
            {users.map(u => (
              <div
                key={u.id}
                onClick={() => setSelectedUser(u)}
                className={`user-item ${selectedUser?.id === u.id ? 'active' : ''}`}
              >
                <span>{u.username}</span>
                <span className={`status-indicator ${u.isOnline ? 'online' : 'offline'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="chat-area">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          {selectedUser ? (
            <>
              <div className="chat-header">
                <h2 className="chat-username">{selectedUser.username}</h2>
                {isTyping && (
                  <div className="typing-indicator">typing...</div>
                )}
              </div>
              <div className="message-list">
                {loading ? (
                  <div className="loading-messages">Loading messages...</div>
                ) : (
                  Array.isArray(messages) && messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message-item ${msg.senderId === user?.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        {msg.content}
                      </div>
                      <div className="message-time">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={sendMessage} className="message-form">
                <div className="flex">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      socket?.emit('typing', {
                        receiverId: selectedUser.id,
                        typing: e.target.value.length > 0
                      });
                    }}
                    className="message-input"
                    placeholder="Type a message..."
                  />
                  <button
                    type="submit"
                    className="send-button"
                    disabled={!message.trim() || loading}
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
    </div>
  );
} 