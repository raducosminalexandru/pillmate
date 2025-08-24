'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  PhotoCamera,
  InsertDriveFile,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 300,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
}));

export default function MedicationUploadPage() {
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  
  const [nameError, setNameError] = useState('');
  const fileInputRef = useRef(null);

  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }
    
    
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    
    setError('');
    
    
    setSelectedFile(file);
    
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    let valid = true;
    
    if (!name.trim()) {
      setNameError('Numele medicamentului este obligatoriu');
      valid = false;
    } else {
      setNameError('');
    }
    
    if (!selectedFile) {
      setError('Vă rugăm să selectați o imagine');
      valid = false;
    }
    
    if (!valid) {
      return;
    }
    
    
    setLoading(true);
    
  
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      
      setSuccess(true);
      
      
      setName('');
      setDescription('');
      handleClearFile();
      
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('A apărut o eroare la încărcarea imaginii. Vă rugăm să încercați din nou.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Încărcare imagine medicament
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Încărcați o imagine a medicamentului pentru a o adăuga în baza de date.
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Imaginea a fost încărcată cu succes!
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <ImagePreviewContainer>
            {previewUrl ? (
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <img 
                  src={previewUrl} 
                  alt="Medication preview" 
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }} 
                />
                <IconButton
                  aria-label="delete image"
                  onClick={handleClearFile}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ) : (
              <Stack direction="column" spacing={1} alignItems="center">
                <InsertDriveFile sx={{ fontSize: 60, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Selectați o imagine sau trageți și plasați-o aici
                </Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<PhotoCamera />}
                >
                  Alegere imagine
                  <VisuallyHiddenInput 
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </Button>
              </Stack>
            )}
          </ImagePreviewContainer>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!nameError}>
                <FormLabel required>Numele medicamentului</FormLabel>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  placeholder="De exemplu: Paracetamol"
                  variant="outlined"
                  error={!!nameError}
                />
                {nameError && <FormHelperText>{nameError}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel>Descriere (opțional)</FormLabel>
                <TextField
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  placeholder="Descrieți medicamentul..."
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                  disabled={loading || !selectedFile}
                >
                  {loading ? 'Se încarcă...' : 'Încarcă imaginea'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
