'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  GridLegacy as Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TodayIcon from '@mui/icons-material/Today';
import BlockIcon from '@mui/icons-material/Block';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface Appointment {
  id: number;
  client_name: string;
  service_name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  price_charged: string;
}

export default function BarberSchedulePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'BARBER')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'BARBER') {
      loadWeekAppointments();
    }
  }, [user, currentWeek]);

  const getWeekDates = () => {
    const week = [];
    const startOfWeek = new Date(currentWeek);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Segunda-feira

    startOfWeek.setDate(startOfWeek.getDate() + diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const loadWeekAppointments = async () => {
    try {
      const weekDates = getWeekDates();
      const startDate = weekDates[0].toISOString().split('T')[0];
      const endDate = weekDates[6].toISOString().split('T')[0];

      const response = await api.get('/appointments/', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      setAppointments(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
      setError('Erro ao carregar agenda.');
    } finally {
      setLoading(false);
    }
  };

  const previousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const nextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
    const colors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
      SCHEDULED: 'primary',
      CONFIRMED: 'primary',
      IN_PROGRESS: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'error',
      NO_SHOW: 'default',
    };
    return colors[status] || 'default';
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const weekDates = getWeekDates();

  if (authLoading || !user || user.role !== 'BARBER') {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => router.push('/dashboard')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Minha Agenda
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<BlockIcon />}
            onClick={() => router.push('/barber/blocks')}
          >
            Bloquear Horários
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Week Navigation */}
        <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={previousWeek}>
            <ArrowBackIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">
              {weekDates[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} -{' '}
              {weekDates[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<TodayIcon />}
              onClick={goToToday}
            >
              Hoje
            </Button>
          </Box>

          <IconButton onClick={nextWeek}>
            <ArrowForwardIcon />
          </IconButton>
        </Paper>

        {/* Week Grid */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {weekDates.map((date, index) => {
              const dayAppointments = getAppointmentsForDate(date);
              const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
              const dayNumber = date.getDate();

              return (
                <Grid item xs={12} md={6} lg key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      minHeight: 400,
                      border: isToday(date) ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                          {dayName}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {dayNumber}
                        </Typography>
                        {isToday(date) && (
                          <Chip label="Hoje" color="primary" size="small" sx={{ mt: 1 }} />
                        )}
                      </Box>

                      {dayAppointments.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                          <Typography variant="body2">Sem agendamentos</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {dayAppointments
                            .sort((a, b) => a.start_time.localeCompare(b.start_time))
                            .map((apt) => (
                              <Paper
                                key={apt.id}
                                elevation={1}
                                sx={{
                                  p: 1.5,
                                  borderLeft: 4,
                                  borderColor: `${getStatusColor(apt.status)}.main`,
                                }}
                              >
                                <Typography variant="body2" fontWeight="bold">
                                  {apt.start_time} - {apt.end_time}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {apt.client_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {apt.service_name}
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                  <Chip
                                    label={apt.status}
                                    color={getStatusColor(apt.status)}
                                    size="small"
                                  />
                                </Box>
                              </Paper>
                            ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
