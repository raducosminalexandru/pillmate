'use client';

import React, { useEffect, useState } from 'react';
import { getAuthHeader } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, Typography, List, ListItem, ListItemText,
  IconButton, Stack, Button, Chip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Medication as MedicationIcon
} from '@mui/icons-material';

type Med = {
  id: number;
  userId: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string | null;
  notes?: string | null;
  reminderTime?: string | null;
  createdAt: string;
  updatedAt: string;
};

const API = process.env.NEXT_PUBLIC_API_URL!;

function fmt(d?: string | null) {
  if (!d) return '';
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? (d as string) : dt.toISOString().slice(0, 10);
}

export default function MedicationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Med[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/medications`, {
        cache: 'no-store',
        headers: { ...getAuthHeader() }, // 👈 trimite tokenul
      });

      if (res.status === 401) {
        router.replace('/signin');      // 👈 dacă nu ești logat
        return;
      }
      if (!res.ok) {
        setError('Failed to load medications.');
        return;
      }

      const data = await res.json();
      setItems(data);
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // dacă nu există token, du-l direct la sign-in
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!t) {
      router.replace('/signin');
      return;
    }
    load();
  }, [router]);

  async function onDelete(id: number) {
    if (!confirm('Delete this medication?')) return;
    try {
      const res = await fetch(`${API}/api/medications/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }, // 👈 trimite tokenul
      });

      if (res.status === 401) {
        router.replace('/signin');
        return;
      }
      if (res.ok) {
        setItems(prev => prev.filter(x => x.id !== id));
      } else {
        alert('Delete failed');
      }
    } catch {
      alert('Delete failed');
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Medications</Typography>
        <Button component={Link} href="/medications/add" startIcon={<AddIcon />} variant="contained">
          Add Medication
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>Current Medications</Typography>

          {error && (
            <Typography color="error" sx={{ mb: 1 }}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Typography>Loading…</Typography>
          ) : items.length === 0 ? (
            <Typography>No medications yet.</Typography>
          ) : (
            <List>
              {items.map(m => (
                <ListItem
                  key={m.id}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <IconButton aria-label="edit" component={Link} href={`/medications/${m.id}/edit`}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => onDelete(m.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  }
                >
                  <MedicationIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight={600}>{m.name}</Typography>
                        <Chip size="small" label={m.dosage} />
                        <Chip size="small" label={m.frequency} variant="outlined" />
                      </Stack>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {`Start: ${fmt(m.startDate)} `}
                        {m.endDate ? `• End: ${fmt(m.endDate)} ` : ''}
                        {m.reminderTime ? `• Reminder: ${m.reminderTime}` : ''}
                        {m.notes ? ` • Notes: ${m.notes}` : ''}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
