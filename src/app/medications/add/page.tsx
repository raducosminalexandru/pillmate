'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, Typography, TextField,
  Grid, Button, Stack
} from '@mui/material';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function AddMedicationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: '',
    reminderTime: ''
  });

  const set = <K extends keyof typeof form>(k: K, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`${API}/api/medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        endDate: form.endDate || null,
        notes: form.notes || null,
        reminderTime: form.reminderTime || null
      })
    });
    setSaving(false);
    if (res.ok) router.push('/medications');
    else alert('Save failed');
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={2}>Add Medication</Typography>
      <Card>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Pill Name *" fullWidth required value={form.name}
                  onChange={e => set('name', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Dosage *" fullWidth required value={form.dosage}
                  onChange={e => set('dosage', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Frequency *" fullWidth required value={form.frequency}
                  onChange={e => set('frequency', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Start Date *" type="date" fullWidth required value={form.startDate}
                  onChange={e => set('startDate', e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="End Date" type="date" fullWidth value={form.endDate}
                  onChange={e => set('endDate', e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Reminder (HH:mm)" fullWidth value={form.reminderTime}
                  onChange={e => set('reminderTime', e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Additional Notes" fullWidth multiline minRows={3} value={form.notes}
                  onChange={e => set('notes', e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button color="inherit" onClick={() => history.back()}>Cancel</Button>
                  <Button type="submit" variant="contained" disabled={saving}>
                    {saving ? 'Saving…' : 'Add Medication'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
