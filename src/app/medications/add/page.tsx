'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthHeader } from '@/lib/auth-client';
import {
  Box, Card, CardContent, Typography, TextField,
  Grid, Button, Stack
} from '@mui/material';

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function AddMedicationPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // dacă nu ai token, du-te la signin
  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!t) router.replace('/signin');
  }, [router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get('name') || ''),
      dosage: String(fd.get('dosage') || ''),
      frequency: String(fd.get('frequency') || ''),
      startDate: String(fd.get('startDate') || ''),
      endDate: (fd.get('endDate') as string) || null,
      notes: (fd.get('notes') as string) || null,
      reminderTime: (fd.get('reminderTime') as string) || null,
    };

    setSaving(true);
    try {
      const res = await fetch(`${API}/api/medications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        router.replace('/signin');
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setFormError(err?.error || 'Save failed.');
        return;
      }

      router.push('/medications');
    } catch {
      setFormError('Network error.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={2}>Add Medication</Typography>
      <Card>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField name="name" label="Pill Name *" fullWidth required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField name="dosage" label="Dosage *" fullWidth required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField name="frequency" label="Frequency *" fullWidth required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="startDate" label="Start Date *" type="date" fullWidth required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="endDate" label="End Date" type="date" fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="reminderTime" label="Reminder (HH:mm)" fullWidth placeholder="09:00"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField name="notes" label="Additional Notes" fullWidth multiline minRows={3} />
              </Grid>

              {formError && (
                <Grid item xs={12}>
                  <Typography color="error">{formError}</Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button color="inherit" onClick={() => router.back()}>Cancel</Button>
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
