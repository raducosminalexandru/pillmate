'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { AccountCircle, Edit, Save } from '@mui/icons-material';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);


  useState(() => {
    if (session?.user) {
      setUsername(session.user.name || '');
      setEmail(session.user.email || '');
    }
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);

    if (session?.user) {
      setUsername(session.user.name || '');
      setEmail(session.user.email || '');
    }
  };

  const handleSave = () => {

    

    setSaveSuccess(true);
    

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
    
    setEditing(false);
  };


  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
        <CircularProgress />
      </Box>
    );
  }


  if (status === 'unauthenticated') {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="error">
          Trebuie să fiți autentificat pentru a vizualiza acest profil.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profil utilizator
      </Typography>
      
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profilul a fost actualizat cu succes!
        </Alert>
      )}

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: 50,
              mr: { xs: 0, sm: 4 },
              mb: { xs: 3, sm: 0 }
            }}
          >
            <AccountCircle fontSize="inherit" />
          </Avatar>
          
          <Box>
            <Typography variant="h5" gutterBottom>
              {username || 'Utilizator'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {email || 'Email nespecificat'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {editing ? (
          <Box component="form">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nume utilizator"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  variant="outlined"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" onClick={handleCancel}>
                    Anulează
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                  >
                    Salvează
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Nume utilizator
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography variant="body1">{username || 'Nespecificat'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography variant="body1">{email || 'Nespecificat'}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                  >
                    Editare profil
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
