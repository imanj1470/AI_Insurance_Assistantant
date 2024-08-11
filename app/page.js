'use client';
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState, useEffect } from "react";

export default function Home() {
  const contentList = [
    "Hello! How can I assist you today?", "How may I help you today?",
    "Thank you for reaching out to us. What can I do for you?",
    "Hi there! Is there anything I can help you with?",
    "Welcome! How can I make your day better today?",
    "Hello! What can I assist you with today?",
    "Hello! We’re here to help. What do you need assistance with?"
  ];

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: ""
    }
  ]);

  useEffect(() => {
    const pickGreeting = () => {
      return contentList[Math.floor(Math.random() * contentList.length)];
    };

    setMessages([{ role: 'assistant', content: pickGreeting() }]);
  }, []);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessage('');
    setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: message },
        { role: 'assistant', content: '' }
    ]);

    try {
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([...messages, { role: 'user', content: message }])
        });

        const data = await response.json();

        if (data && data.content) {
            setMessages((prevMessages) => {
                let updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = { role: 'assistant', content: data.content };
                return updatedMessages;
            });
        } else {
            console.error('Content property missing in the response');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Stack direction="column" width="600px" height="700px" border="1px solid black" p={2} spacing={2}>
        <Stack direction="column" spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
          {
            messages.map((message, index) => (
              <Box key={index} display='flex' justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                <Box p={3} borderRadius={16} color="white" bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}>
                  {message.content || <span style={{ opacity: 0.5 }}>Loading...</span>}
                </Box>
              </Box>
            ))
          }
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField label="message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
