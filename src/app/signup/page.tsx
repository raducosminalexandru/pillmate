'use client';

import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Divider,
  FormLabel,
  FormControl,
  Link as MuiLink,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import logoIcon from './logo.svg';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL!; // e.g. http://localhost:4000

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
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  // @ts-ignore - some themes expose applyStyles
  ...theme.applyStyles?.('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100vh',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    // @ts-ignore
    ...theme.applyStyles?.('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const SignUp: React.FC = () => {
  const router = useRouter();

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validateInputs()) return;

    // Colectăm valorile din formular
    const fd = new FormData(event.currentTarget);
    const name = String(fd.get('name') || '');
    const email = String(fd.get('email') || '');
    const password = String(fd.get('password') || '');

    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          setEmailError(true);
          setEmailErrorMessage('This email is already registered.');
          return;
        }
        if (res.status === 400) {
          const err = await res.json().catch(() => ({}));
          setFormError(err?.error || 'Validation error. Please check your inputs.');
          return;
        }
        const err = await res.json().catch(() => ({}));
        setFormError(err?.error || 'Signup failed. Please try again.');
        return;
        }

      const data = await res.json(); // { user, token }
      localStorage.setItem('token', data.token);

      router.push('/medications'); // sau /dashboard
    } catch (error) {
      console.error('Signup error:', error);
      setFormError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement | null;
    const password = document.getElementById('password') as HTMLInputElement | null;
    const name = document.getElementById('name') as HTMLInputElement | null;

    let isValid = true;

    if (!email?.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password?.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name?.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Please enter your name.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <img
            src={logoIcon.src}
            alt="Logo"
            style={{ width: 64, height: 64, alignSelf: 'center' }}
          />
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <TextField
                error={nameError}
                helperText={nameErrorMessage}
                id="name"
                name="name"
                placeholder="John Doe"
                autoComplete="name"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>

            <FormControlLabel
              control={<Checkbox value="agree" color="primary" required />}
              label="I agree to the terms and conditions"
            />

            <Button type="submit" fullWidth variant="contained" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>

            {formError && (
              <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                {formError}
              </Typography>
            )}
          </Box>

          <Divider>or</Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <MuiLink href="/signin" variant="body2" sx={{ alignSelf: 'center' }}>
                Sign in
              </MuiLink>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  );
};

export default SignUp;
