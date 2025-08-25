'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Fab,
  Paper,
  TextField,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  CalendarMonth,
  Medication,
  QrCodeScanner,
  Chat as ChatIcon,
  Close,
  Send,
} from '@mui/icons-material';
import Link from 'next/link';

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  
  
  const toggleChat = () => {
    setOpen(!open);
  };
  
  
  const handleSend = (e) => {
    e.preventDefault();
    
    setInput('');
    
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {open ? (
        <Paper 
          elevation={3} 
          sx={{ 
            width: 320,
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          {/* Chat */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mr: 1 }}>
                <ChatIcon />
              </Avatar>
              <Typography variant="h6">PillMate Assistant</Typography>
            </Box>
            <IconButton onClick={toggleChat} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
          
          {/* Chat messages area */}
          <Box sx={{ 
            flexGrow: 1, 
            p: 2, 
            overflowY: 'auto',
            bgcolor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Paper sx={{ 
              alignSelf: 'flex-start', 
              p: 1, 
              mb: 1, 
              maxWidth: '80%',
              borderRadius: '18px 18px 18px 4px'
            }}>
              <Typography variant="body2">
                Bună ziua! Cum vă pot ajuta astăzi cu administrarea medicamentelor?
              </Typography>
            </Paper>
          </Box>
          
          {/* Chat */}
          <Box component="form" onSubmit={handleSend} sx={{ 
            p: 1, 
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'white',
            display: 'flex'
          }}>
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scrieți un mesaj..."
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mr: 1 }}
            />
            <IconButton 
              type="submit" 
              color="primary"
              disabled={!input.trim()}
            >
              <Send />
            </IconButton>
          </Box>
        </Paper>
      ) : (
        <Fab 
          color="primary" 
          aria-label="chat" 
          onClick={toggleChat}
          sx={{ 
            boxShadow: 3,
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <ChatIcon />
        </Fab>
      )}
    </Box>
  );
}

function DeleteButton({ id }: { id:number }) {
  const api = process.env.NEXT_PUBLIC_API_URL!;
  const onDelete = async () => {
    if (!confirm("Delete this medication?")) return;
    const res = await fetch(`${api}/api/medications/${id}`, { method: "DELETE" });
    if (res.ok) location.reload();
    else alert("Delete failed");
  };
  return <button onClick={onDelete}>Delete</button>;
};

export default function HomePage() {
  const quickActions = [
    {
      title: 'Dashboard',
      description: 'View your daily summary and medication adherence',
      icon: <Dashboard />,
      href: '/dashboard',
      color: 'primary',
    },
    {
      title: 'Calendar',
      description: 'Manage your medication schedule',
      icon: <CalendarMonth />,
      href: '/calendar',
      color: 'secondary',
    },
    {
      title: 'Medications',
      description: 'View and manage your medication list',
      icon: <Medication />,
      href: '/medications',
      color: 'success',
    },
    {
      title: 'Scan Pill',
      description: 'Scan a pill to identify medication',
      icon: <QrCodeScanner />,
      href: '/scan',
      color: 'info',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to PillMate
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your comprehensive medication management solution
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your medications, scan pills, and maintain your health with ease
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {quickActions.map((action) => (
          <Card key={action.title} sx={{ height: '100%' }}>
            <CardActionArea
              component={Link}
              href={action.href}
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: `${action.color}.light`,
                      color: `${action.color}.main`,
                      mb: 2,
                    }}
                  >
                    {action.icon}
                  </Box>
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Use the sidebar navigation to explore all features, or click on any of the cards above to get started quickly.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          href="/dashboard"
          sx={{ mr: 2 }}
        >
          Go to Dashboard
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          href="/medications/add"
        >
          Add First Medication
        </Button>
      </Box>
      
      {}
      <ChatBot />
    </Box>
  );
}
