'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
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
    // TODO: Add form submission logic (e.g., API call)
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Medication
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Pill Name"
                name="pillName"
                fullWidth
                required
                value={formData.pillName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dosage"
                name="dosage"
                fullWidth
                required
                placeholder="E.g., 500mg"
                value={formData.dosage}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Frequency"
                name="frequency"
                fullWidth
                required
                placeholder="E.g., Twice a day"
                value={formData.frequency}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Additional Notes (optional)"
                name="notes"
                fullWidth
                multiline
                rows={4}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
            {/* Additional idea: Set a reminder before taking medication */}
            <Grid item xs={12}>
              <TextField
                label="Reminder (optional)"
                name="reminder"
                fullWidth
                placeholder="E.g., Remind me 30 minutes before"
                helperText="Set a reminder for taking your medication"
                value={formData.reminder}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" fullWidth>
                Add Medication
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}