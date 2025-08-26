'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper
} from '@mui/material';

export default function AddMedicationPage() {
  const [formData, setFormData] = useState({
    pillName: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: '',
    reminder: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // TODO: Add form submission logic (example: API call)
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Medication
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Pill Name"
              name="pillName"
              fullWidth
              required
              value={formData.pillName}
              onChange={handleChange}
            />
            <TextField
              label="Dosage"
              name="dosage"
              fullWidth
              required
              placeholder="E.g., 500mg"
              value={formData.dosage}
              onChange={handleChange}
            />
            <TextField
              label="Frequency"
              name="frequency"
              fullWidth
              required
              placeholder="E.g., Twice a day"
              value={formData.frequency}
              onChange={handleChange}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={handleChange}
              />
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={handleChange}
              />
            </Stack>
            <TextField
              label="Additional Notes (optional)"
              name="notes"
              fullWidth
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleChange}
            />
            <TextField
              label="Reminder (optional)"
              name="reminder"
              fullWidth
              placeholder="E.g., Remind me 30 minutes before"
              helperText="Set a reminder for taking your medication"
              value={formData.reminder}
              onChange={handleChange}
            />
            <Button variant="contained" type="submit" fullWidth>
              Add Medication
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
