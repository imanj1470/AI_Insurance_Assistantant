'use client'
import { Box, Button, Stack, TextField, Typography, Modal, IconButton } from "@mui/material";
import { useState, useEffect, useInsertionEffect, useRef } from "react";
import Image from 'next/image';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const [rating, setRating] = useState(0);
  const handleClick = (value) => {
    setRating(value);
    //store in database
    console.log(value)
  };




  useEffect(() => {
    const pickGreeting = () => {
      return contentList[Math.floor(Math.random() * contentList.length)];
    };

    closeModal()

    setMessages([{ role: 'assistant', content: pickGreeting() }]);
  }, []);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message)
      return;
    setMessage('');
    const newMessage = { role: 'user', content: message }
    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
      { role: 'assistant', content: '' }
    ]);
    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([...messages, newMessage])
      });
      const data = await response.json();

      if (data && data.content) {
        setMessages((messages) => {
          let updatedMessages = [...messages];
          updatedMessages[updatedMessages.length - 1].content = data.content;


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
        <Modal open={isModalOpen} onClose={closeModal}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: "translate(-50%, -50%)", }}
            width={500}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display={"flex"}
            flexDirection="column"
            alignItems="center"
            gap={3}
          >
            <Typography color="#212427" variant="h5">How do you rate your experience?</Typography>
            <Box display="flex" alignItems="center">
              {Array.from({ length: 5 }, (_, index) => (
                <IconButton
                  key={index}
                  onClick={() => handleClick(index + 1)}
                  sx={{
                    p: 0,
                    color: index < rating ? '#FFD700' : '#ccc',
                  }}
                >
                  {index < rating ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
              ))}
            </Box>

            <Button variant="contained" onClick={closeModal}>Submit</Button>
          </Box>

        </Modal>

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
          position="relative"
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
              padding={3}
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
                    <Typography color="#0b1215">{message.content || <span style={{ opacity: 0.5 }}>Loading...</span>}</Typography>
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
                onKeyDown={(e) => {
                  if (e.key == 'Enter') {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                variant="outlined"
                sx={{
                  bgcolor: "white",
                  borderRadius: 1,
                  boxShadow: "0px 2px 4px rgba(0, 0, 100, 0.1)",
                }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  sendMessage()
                }
                }
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

          <Button
            onClick={openModal}
            sx={{
              position: "absolute",
              right: "20px",
              bottom: "10px",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              bgcolor: "#447bc9",
              "&:hover": {
                bgcolor: "#3568a5",
              },
              display: "flex",
              flexDirection: "column", // This allows you to stack the icon and text
              justifyContent: "center",
              alignItems: "center",
              padding: 0,
            }}
          >
            <Image alt="star" src="/star.png" width={22} height={22} />
          </Button>

        </Box>

      </Box>



    </>
  )
}
