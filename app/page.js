'use client'
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { useState, useInsertionEffect, useEffect } from "react";



export default function Home() {
  const contentList = ["Hello! How can I assist you today?", "How may I help you today?",
    "Thank you for reaching out to us. What can I do for you?",
    "Hi there! Is there anything I can help you with?",
    "Welcome! How can I make your day better?",
    "Hello! What can I assist you with today?",
    "Hello! We’re here to help. What do you need assistance with?"
  ]

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: ""
    }
  ])

  useEffect(() => {
    const pickGreeting = () => {
      return contentList[Math.floor(Math.random() * contentList.length)];
    };

    setMessages([{ role: 'assistant', content: pickGreeting() }]);
  }, []);

  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' }
    ])
    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }])
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({ done, value }) {
        if (done)
          return result;
        const text = decoder.decode(value || new Int8Array(), { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [...otherMessages, { ...lastMessage, content: lastMessage.content + text }]
        })
        return reader.read().then(processText)
      })
    })
  }

  return (
    <>
      <Box
  width="100vw"
  height="100vh"
  display="flex"
  justifyContent="center"
  alignItems="center"
  gap={2}
  flexDirection="column"
  p={2}
  sx={{
    background: 'linear-gradient(135deg, #1E3A8A 0%, #E0F2FF 100%)', // Deep blue to very light blue
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>

  <Box
    width="60vw"
    height="15vh"
    bgcolor="#ffff80"
    borderRadius={2}
    display="flex"
    justifyContent="center"
    alignItems="center"
    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
    p={2}
  >
    <Typography
      fontFamily="cursive"
      color="#333"
      variant="h4"
      fontWeight="bold"
    >
      Customer Assistant
    </Typography>
  </Box>

  <Box
    width="100vw"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    mt={2}
  >
    <Stack
      direction="column"
      width="60vw"
      height="75vh"
      border="1px solid #ccc"
      p={2}
      spacing={2}
      borderRadius={2}
      bgcolor="#ffffe6"
      boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)"
      overflow="hidden"
    >
      <Stack
        direction="column"
        spacing={2}
        flexGrow={1}
        overflow="auto"
        maxHeight="100%"
        pr={1} // Adds padding to prevent scrollbar overlap
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            p={1}
          >
            <Box
              p={2}
              borderRadius={16}
              bgcolor={message.role === 'assistant' ? 'rgba(184, 188, 188, 0.64)' : '#66adff'}
              boxShadow="0px 3px 6px rgba(0, 0, 0, 0.1)"
              maxWidth="70%"
            >
              <Typography color="#0b1215">{message.content}</Typography>
            </Box>
          </Box>
        ))}
      </Stack>
      
      <Stack direction="row" spacing={2} mt={1}>
        <TextField
          label="Type your message..."
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="outlined"
          sx={{
            bgcolor: "white",
            borderRadius: 1,
            boxShadow: "0px 2px 4px rgba(0, 0, 100, 0.1)",
          }}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          sx={{
            bgcolor: "#447bc9",
            color: "white",
            borderRadius: 1,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              bgcolor: "#3568a5",
            },
          }}
        >
          Send
        </Button>
      </Stack>
    </Stack>
  </Box>

</Box>



    </>
  )
}