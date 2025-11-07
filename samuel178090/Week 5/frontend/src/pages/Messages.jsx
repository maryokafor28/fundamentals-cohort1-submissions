import { useState, useEffect } from 'react';
import { messageService } from '../services/messageService';

const Messages = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await messageService.getMessages();
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await messageService.markAsRead(messageId);
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading messages...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c5aa0', marginBottom: '2rem' }}>💬 Messages</h1>

      {messages.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>No messages yet</h3>
          <p style={{ color: '#888' }}>You'll see messages from your doctor here</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {messages.map(message => (
            <div
              key={message._id}
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                border: message.isRead ? '1px solid #e1e8ed' : '3px solid #4a90e2',
                cursor: !message.isRead ? 'pointer' : 'default'
              }}
              onClick={() => !message.isRead && markAsRead(message._id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: '#2c5aa0', margin: 0 }}>{message.subject}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                  {!message.isRead && (
                    <span style={{
                      background: '#4a90e2',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      NEW
                    </span>
                  )}
                </div>
              </div>
              
              <p style={{ color: '#333', lineHeight: '1.6', marginBottom: '1rem' }}>
                {message.message}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#2c5aa0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Dr
                </div>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  From your doctor
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;