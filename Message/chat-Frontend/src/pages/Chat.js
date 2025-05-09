import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import './styles/Chat.css';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import endpoints from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSearch, faSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

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
  const [searchQuery, setSearchQuery] = useState('');
  const messageListRef = useRef(null);

  useEffect(() => {
    const newSocket = io('https://api.jtaskhubbeta.com.au', {
      path: '/socket.io/',  // <-- add this explicitly
      auth: {
        token: localStorage.getItem('token')
      },
      transports: ['polling','websocket']
    });
  
    const handleMessage = (newMessage) => {
      if (newMessage) {
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (!exists) {
            return [...prev, newMessage];
          }
          return prev;
        });
  
        if (selectedUser && newMessage.senderId === selectedUser.id) {
          newSocket.emit('messageRead', {
            messageId: newMessage.id,
            senderId: newMessage.senderId
          });
        }
      }
    };
  
    const handleTyping = ({ userId, typing }) => {
      if (selectedUser?.id === userId) {
        setIsTyping(typing);
      }
    };
  
    const handleMessageRead = ({ messageId }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    };
  
    const handleUserStatus = ({ userId, isOnline }) => {
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, isOnline } : u
        )
      );
    };
  
    newSocket.on('connect', () => console.log('✅ Connected to socket server'));
    newSocket.on('message', handleMessage);
    newSocket.on('typing', handleTyping);
    newSocket.on('messageRead', handleMessageRead);
    newSocket.on('userStatus', handleUserStatus);
  
    setSocket(newSocket);
  
    return () => {
      newSocket.off('message', handleMessage);
      newSocket.off('typing', handleTyping);
      newSocket.off('messageRead', handleMessageRead);
      newSocket.off('userStatus', handleUserStatus);
      newSocket.close();
    };
  }, []);
  

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
            setMessages(data);
            
            data.forEach(msg => {
              if (!msg.read && msg.senderId === selectedUser.id) {
                socket?.emit('messageRead', {
                  messageId: msg.id,
                  senderId: msg.senderId
                });
              }
            });
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

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && selectedUser && user) {
      try {
        setLoading(true);
        const response = await fetch(endpoints.messages.send(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            receiverId: selectedUser.id,
            content: message.trim()
          })
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-container">
      <nav className="menu">
        <ul className="items">
          <li className="item">
            <Link to='/'>
              <FontAwesomeIcon icon={faHome} />
            </Link>
          </li>
          <li className="item">
            <Link to='/profile'>
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar">
        <div className="search">
          <div className="searchbar">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="user-list">
          {filteredUsers.map(u => (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`user-item ${selectedUser?.id === u.id ? 'active' : ''}`}
            >
              <div className="user-photo">
                <div className={`status-indicator ${u.isOnline ? 'online' : 'offline'}`} />
              </div>
              <div className="user-info">
                <p className="username">{u.username}</p>
                {/* Add last message preview here if available */}
              </div>
            </div>
          ))}
        </div>
      </div>

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
            <div className="message-list" ref={messageListRef}>
              {loading ? (
                <div className="loading-messages">Loading messages...</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item ${msg.senderId === user?.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      {msg.content}
                    </div>
                    <div className="message-time">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                      {msg.senderId === user?.id && (
                        <span className="read-status">
                          {msg.read ? ' ✓✓' : ' ✓'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={sendMessage} className="message-form">
              <FontAwesomeIcon icon={faSmile} className="emoji-button" />
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
                placeholder="Type your message here"
              />
              <button
                type="submit"
                className="send-button"
                disabled={!message.trim() || loading}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
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