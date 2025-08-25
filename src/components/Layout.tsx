'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  CalendarMonth,
  Medication,
  Add,
  QrCodeScanner,
  History,
  Settings,
  Help,
  Home,
  Person,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'Home', icon: <Home />, href: '/' },
  { text: 'Dashboard', icon: <Dashboard />, href: '/dashboard' },
  { text: 'Calendar', icon: <CalendarMonth />, href: '/calendar' },
  { text: 'Medicații', icon: <Medication />, href: '/medications' },
  { text: 'Adaugă medicament', icon: <Add />, href: '/medications/add' },
  { text: 'Scanare pastilă', icon: <QrCodeScanner />, href: '/medications/upload' },
  { text: 'Istoric / Logs', icon: <History />, href: '/history' },
  { text: 'Setări', icon: <Settings />, href: '/settings' },
  { text: 'Help / About', icon: <Help />, href: '/help' },
];

export default function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing(2),
          minHeight: 64,
        }}
      >
        <Typography variant="h6" noWrap component="div">
          PillMate
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={pathname === item.href}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: pathname === item.href ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header remains fixed across full width */}
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {menuItems.find(item => item.href === pathname)?.text || 'PillMate'}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <Person />
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Drawer opens below header as an overlay */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          anchor="left"
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              // Position the drawer below the header using the toolbar height from the theme
              top: theme.mixins.toolbar.minHeight,
              // Use responsive widths
              width: { xs: '75%', md: '25%' },
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Main content; add top padding to avoid being hidden behind header */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
          }}
        >
          <Toolbar />
          {children}
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem component={Link} href="/profile">Profile</MenuItem>
          <MenuItem component={Link} href="/settings">Settings</MenuItem>
          <Divider />
          <MenuItem>Logout</MenuItem>
        </Menu>
      </Box>
    </ProtectedRoute>
  );
}
