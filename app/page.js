'use client'
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { useState, useInsertionEffect, useEffect } from "react";



export default function Home() {
  const contentList = ["Hello! How can I assist you today?", "How may I help you today?",
    "Thank you for reaching out to us. What can I do for you?",
    "Hi there! Is there anything I can help you with?",
    "Welcome! How can I make your day better today?",
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
      <Box width="100vw" height="100vh" display="flex" justifyContent="center" 
      alignItems="center" gap={2} flexDirection="column"
      /* bgcolor="#F8F0E3" */ bgcolor="#fffcf5"
      >

        <Box width="60vw" height = "15vh" bgcolor="#D2B8FC" marginTop="12px" 
        borderRadius={1} display="flex" justifyContent="center" alignItems="center">
        <Typography fontFamily="cursive" colour="#333" variant="h4">Customer Assistant</Typography>
        </Box>

        <Box width="100vw" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Stack direction="column" width="60vw" height="80vh" border="1px solid black" p={2} spacing={2}
          borderRadius={1} marginBottom="20px" bgcolor="#f5f7d7"
          >
            <Stack direction="column" spacing={2} flexGrow={1} overflow="auto" maxHeight="100%">
              {
                messages.map((message, index) => (
                  <Box key={index} display='flex' justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                    <Box p={3} borderRadius={16} color="white" bgcolor={message.role === 'assistant' ? 'rgba(184, 188, 188, 0.64)' : '#3437EF'}>
                      <Typography color="black">{message.content}</Typography>
                    </Box>
                  </Box>
                ))
              }
            </Stack>
            { /* this stack below isn't showing */}
            <Stack direction="row" spacing={2}>
              <TextField label="Message" fullWidth value={message} onChange={(e) => setMessage(e.target.value)}></TextField>
              <Button variant="contained" onClick={sendMessage}  
              sx = {{bgcolor:"#447bc9"}}
              >Send</Button>
            </Stack>
          </Stack>
        </Box>

      </Box>
    </>
  )
}