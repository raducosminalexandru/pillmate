'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Medication,
  Add,
  QrCodeScanner,
  History,
  Settings,
  Help,
  Home,
  Person,
} from '@mui/icons-material';

export default function MedicationsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Medications
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Current Medications</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Medication />
              </ListItemIcon>
              <ListItemText primary="Medication Name" secondary="Dosage Information" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
