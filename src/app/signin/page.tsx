'use client';

import React from 'react';
import {
  Box, Button, Checkbox, CssBaseline, FormControl, FormControlLabel,
  FormLabel, Link as MuiLink, TextField, Typography, Divider, Stack, Card as MuiCard
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import logoIcon from './logo.svg';

// --- stilurile tale, le poți păstra cum le aveai ---
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  maxHeight: '90vh',
  overflowY: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100vh',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
}));

export default function SignIn() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get('callbackUrl') ?? '/';

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  function validateInputs(form: HTMLFormElement) {
    const email = (form.querySelector('#email') as HTMLInputElement)?.value || '';
    const password = (form.querySelector('#password') as HTMLInputElement)?.value || '';
    let ok = true;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email.');
      ok = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters.');
      ok = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return ok;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const form = event.currentTarget;
    if (!validateInputs(form)) return;

    const data = new FormData(form);
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');

    setIsLoading(true);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,     // nu lăsa NextAuth să redirecționeze implicit
      callbackUrl,         // unde vrem să ajungem după login
    });
    setIsLoading(false);

    if (result?.error) {
      setFormError(result.error);
      setPasswordError(true);
      setPasswordErrorMessage(result.error);
      return;
    }

    // succes -> mergem în aplicație
    router.replace(callbackUrl);
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <img src={logoIcon.src} alt="Logo" style={{ width: 64, height: 64, alignSelf: 'center' }} />

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                id="password"
                name="password"
                type="password"
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
              />
            </FormControl>

            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />

            {formError && (
              <Typography color="error" variant="body2">{formError}</Typography>
            )}

            <Button type="submit" fullWidth variant="contained" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>

            <MuiLink href="/signup" variant="body2" sx={{ alignSelf: 'center' }}>
              Don&apos;t have an account? Sign up
            </MuiLink>
          </Box>

          <Divider>or</Divider>
          {/* alte acțiuni sociale, dacă e cazul */}
        </Card>
      </SignInContainer>
    </>
  );
}
