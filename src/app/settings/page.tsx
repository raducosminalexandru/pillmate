'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Switch, 
  FormControlLabel, 
  Paper,
  Radio,
  RadioGroup,
  FormControl,
  Divider,
  useTheme
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import { useColorMode } from '@/components/ThemeRegistry';

export default function SettingsPage() {
  
  const { mode, setMode } = useColorMode();
  const darkMode = mode === 'dark';
  
  
  const [fontSize, setFontSize] = useState('medium');
  
  const theme = useTheme();
  
  
  useEffect(() => {
    try {
      const savedFontSize = window.localStorage.getItem('fontSize') || 'medium';
      setFontSize(savedFontSize);
    } catch (error) {
      console.error('Eroare la încărcarea setărilor:', error);
    }
  }, []);
  
  
  useEffect(() => {
    try {
      window.localStorage.setItem('fontSize', fontSize);
      
      
      document.documentElement.style.fontSize = getFontSizeValue(fontSize);
    } catch (error) {
      console.error('Eroare la salvarea setărilor:', error);
    }
  }, [fontSize]);
  
  
  const handleThemeChange = (event) => {
    setMode(event.target.checked ? 'dark' : 'light');
  };
  
  
  const handleFontSizeChange = (event) => {
    setFontSize(event.target.value);
  };
  
  
  const getFontSizeValue = (size) => {
    switch (size) {
      case 'small':
        return '0.875rem';
      case 'medium':
        return '1rem';
      case 'large':
        return '1.125rem';
      case 'extra-large':
        return '1.25rem';
      default:
        return '1rem';
    }
  };
  
  
  const sampleText = "Exemplu de text pentru a demonstra mărimea fontului.";
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Setări
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Temă
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={handleThemeChange}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {darkMode ? (
                  <>
                    <Brightness4Icon sx={{ mr: 1 }} />
                    <Typography>Mod întunecat</Typography>
                  </>
                ) : (
                  <>
                    <Brightness7Icon sx={{ mr: 1 }} />
                    <Typography>Mod luminos</Typography>
                  </>
                )}
              </Box>
            }
          />
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FormatSizeIcon sx={{ mr: 1 }} /> Mărimea fontului
          </Typography>
          
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="mărimea-fontului"
              name="fontSize"
              value={fontSize}
              onChange={handleFontSizeChange}
            >
              <FormControlLabel value="small" control={<Radio />} label="Mic" />
              <FormControlLabel value="medium" control={<Radio />} label="Mediu" />
              <FormControlLabel value="large" control={<Radio />} label="Mare" />
              <FormControlLabel value="extra-large" control={<Radio />} label="Foarte mare" />
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 3, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Previzualizare:
            </Typography>
            <Typography style={{ fontSize: getFontSizeValue(fontSize) }}>
              {sampleText}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
