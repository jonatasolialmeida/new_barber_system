'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Stack,
  Divider,
  alpha,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  Dashboard,
  Person,
  Logout,
  Menu as MenuIcon,
  CalendarMonth,
} from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/designTokens';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface NavbarProps {
  title?: string;
}

/**
 * Navbar - Barra de navegação principal
 *
 * Features:
 * - ThemeToggle integrado
 * - Menu de usuário com avatar
 * - Logo animada
 * - Glassmorphism design
 * - Responsivo
 */
export default function Navbar({ title }: NavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
    handleMenuClose();
  };

  const handleDashboard = () => {
    router.push('/dashboard');
    handleMenuClose();
  };

  const getUserInitials = () => {
    if (!user) return '?';
    const firstInitial = user.first_name?.[0] || '';
    const lastInitial = user.last_name?.[0] || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: 'blur(20px)',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(colors.background.darkPaper, 0.8)
            : alpha(colors.white, 0.8),
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        {/* Logo */}
        <MotionBox
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }}
          onClick={() => router.push('/dashboard')}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: colors.gradients.barber,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarMonth sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 'bold',
              background: colors.gradients.barber,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {title || 'Barber System'}
          </Typography>
        </MotionBox>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Theme Toggle */}
        <ThemeToggle size="medium" />

        {/* User Menu */}
        {user && (
          <>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={anchorEl ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={anchorEl ? 'true' : undefined}
            >
              <Avatar
                sx={{
                  bgcolor: colors.primary[500],
                  width: 40,
                  height: 40,
                  fontWeight: 'bold',
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>

            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 8,
                sx: {
                  minWidth: 220,
                  mt: 1.5,
                  borderRadius: 2,
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* User Info */}
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <MenuItem onClick={handleDashboard}>
                <Dashboard fontSize="small" sx={{ mr: 1.5 }} />
                Dashboard
              </MenuItem>

              <MenuItem onClick={handleProfile}>
                <Person fontSize="small" sx={{ mr: 1.5 }} />
                Meu Perfil
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <Logout fontSize="small" sx={{ mr: 1.5 }} />
                Sair
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
