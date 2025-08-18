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
  Notifications,
  CheckCircle,
  QrCodeScanner,
  Schedule,
  TrendingUp,
  Add,
  CalendarMonth,
} from '@mui/icons-material';

export default function CalendarPage() {
  // Mock data
  const nextReminders = [
    { id: 1, time: '09:00', medication: 'Aspirin', status: 'pending' },
    { id: 2, time: '12:00', medication: 'Vitamin D', status: 'pending' },
    { id: 3, time: '18:00', medication: 'Ibuprofen', status: 'pending' },
  ];

  const recentScans = [
    { id: 1, medication: 'Aspirin', date: '2024-01-15', time: '08:45' },
    { id: 2, medication: 'Vitamin D', date: '2024-01-14', time: '12:30' },
    { id: 3, medication: 'Ibuprofen', date: '2024-01-14', time: '18:15' },
  ];

  const adherencePercentage = 87;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Sumar zilnic
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
        {/* Next Reminders Card */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Notifications color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Next Reminders</Typography>
            </Box>
            <List dense>
              {nextReminders.map((reminder) => (
                <ListItem key={reminder.id} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Schedule color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={reminder.medication}
                    secondary={reminder.time}
                  />
                  <Chip
                    label="Pending"
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Adherence Percentage Card */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Adherence %</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h3" color="primary" sx={{ mr: 2 }}>
                {adherencePercentage}%
              </Typography>
              <CheckCircle color="success" />
            </Box>
            <LinearProgress
              variant="determinate"
              value={adherencePercentage}
              sx={{ height: 8, borderRadius: 4 }}
            />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This week&apos;s medication adherence
              </Typography>
          </CardContent>
        </Card>

        {/* Recent Scans Card */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <QrCodeScanner color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Recent Scans</Typography>
            </Box>
            <List dense>
              {recentScans.map((scan) => (
                <ListItem key={scan.id} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                      <QrCodeScanner sx={{ fontSize: 16 }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={scan.medication}
                    secondary={`${scan.date} at ${scan.time}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<Add />}
              label="Add Medication"
              color="primary"
              variant="outlined"
              clickable
            />
            <Chip
              icon={<QrCodeScanner />}
              label="Scan Pill"
              color="secondary"
              variant="outlined"
              clickable
            />
            <Chip
              icon={<CalendarMonth />}
              label="View Calendar"
              color="info"
              variant="outlined"
              clickable
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
