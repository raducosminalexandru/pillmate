'use client';

import React, { useState } from 'react';
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
  Notifications,
  CheckCircle,
  MedicalInformation,
  Schedule,
  TrendingUp,
  Add,
  CalendarMonth,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [todaysReminders, setTodaysReminders] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  
  
  const adherencePercentage = 0;
  
  
  const handleQuickAction = (action) => {
    switch (action) {
      case 'add':
        router.push('/medications/add');
        break;
      case 'calendar':
        router.push('/calendar');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Panou principal
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Sumar zilnic
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
        {/* Următoarele medicamente */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Notifications color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Următoarele medicamente</Typography>
            </Box>
            {todaysReminders.length > 0 ? (
              <List dense>
                {todaysReminders.map((reminder) => (
                  <ListItem key={reminder.id} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Schedule color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${reminder.medication} ${reminder.dosage}`}
                      secondary={reminder.time}
                    />
                    <Chip
                      label="În așteptare"
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                Nu aveți medicamente programate pentru astăzi. Adăugați medicamente pentru a vedea programul.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Conformare tratament */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Conformare tratament</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h3" color="primary" sx={{ mr: 2 }}>
                {adherencePercentage}%
              </Typography>
              <CheckCircle color={adherencePercentage > 0 ? "success" : "disabled"} />
            </Box>
            <LinearProgress
              variant="determinate"
              value={adherencePercentage}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Respectarea tratamentului în această săptămână
            </Typography>
          </CardContent>
        </Card>

        {/*Medicamente adăugate recent*/}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MedicalInformation color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Medicamente adăugate recent</Typography>
            </Box>
            {recentlyAdded.length > 0 ? (
              <List dense>
                {recentlyAdded.map((med) => (
                  <ListItem key={med.id} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                        <MedicalInformation sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={`${med.name} ${med.dosage}`}
                      secondary={`Adăugat pe ${formatDate(med.addedDate)}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                Nu ați adăugat medicamente recent. Utilizați butonul "Adaugă medicament" pentru a începe.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acțiuni rapide
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<Add />}
              label="Adaugă medicament"
              color="primary"
              variant="outlined"
              clickable
              onClick={() => handleQuickAction('add')}
            />
            <Chip
              icon={<CalendarMonth />}
              label="Vezi calendarul"
              color="info"
              variant="outlined"
              clickable
              onClick={() => handleQuickAction('calendar')}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

// Helper function to format dates in Romanian format
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ro-RO', options);
}
