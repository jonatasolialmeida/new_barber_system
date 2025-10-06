'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';

interface Appointment {
  id: number;
  service_name: string;
  barber_name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  price_charged: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      const response = await api.get('/appointments/');
      setAppointments(response.data.results || response.data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      SCHEDULED: 'info',
      CONFIRMED: 'primary',
      IN_PROGRESS: 'warning',
      COMPLETED: 'success',
      CANCELLED: 'error',
      NO_SHOW: 'default',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      SCHEDULED: 'Agendado',
      CONFIRMED: 'Confirmado',
      IN_PROGRESS: 'Em Andamento',
      COMPLETED: 'Concluído',
      CANCELLED: 'Cancelado',
      NO_SHOW: 'Não Compareceu',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  if (authLoading || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom>
                Olá, {user.first_name}! 👋
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
            <Button variant="outlined" color="error" onClick={logout}>
              Sair
            </Button>
          </Box>
        </Paper>

        {/* Ações Rápidas */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {user.role === 'OWNER' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => router.push('/admin/overview')}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <DashboardIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6">Dashboard Admin</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Resumo financeiro
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => router.push('/admin/barbers')}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <PeopleIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                    <Typography variant="h6">Barbeiros</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gerenciar equipe
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => router.push('/admin/services')}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <ContentCutIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6">Serviços</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gerenciar serviços
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => router.push('/admin/appointments')}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <EventIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                    <Typography variant="h6">Agendamentos</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ver todos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => router.push('/appointments/new')}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6">Novo Agendamento</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Agende um horário
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {user.role === 'CLIENT' && (
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => router.push('/appointments/new')}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6">Novo Agendamento</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Agende um horário
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {user.role === 'BARBER' && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => router.push('/appointments/new')}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6">Novo Agendamento</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Agende um horário
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => router.push('/barber/schedule')}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <CalendarMonthIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6">Minha Agenda</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ver agenda semanal
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => router.push('/barber/reports')}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <AssessmentIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6">Relatórios</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ver ganhos e atendimentos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={6} md={user.role === 'OWNER' ? 4 : 4}>
            <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => router.push('/appointments/history')}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <EventIcon sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                <Typography variant="h6">{appointments.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Agendamentos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={user.role === 'OWNER' ? 4 : 4}>
            <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => router.push('/appointments/history?status=COMPLETED')}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <EventIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                <Typography variant="h6">
                  {appointments.filter(a => a.status === 'COMPLETED').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Agendamentos Concluídos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Lista de Agendamentos */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h5">
              Últimos Agendamentos
            </Typography>
            {appointments.length > 3 && (
              <Button
                variant="text"
                onClick={() => router.push('/appointments/history')}
              >
                Ver Todos
              </Button>
            )}
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : appointments.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                Você ainda não tem agendamentos
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
                onClick={() => router.push('/appointments/new')}
              >
                Fazer Primeiro Agendamento
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {appointments.slice(0, 3).map((appointment) => (
                <Grid item xs={12} key={appointment.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start">
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {appointment.service_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Barbeiro: {appointment.barber_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            📅 {formatDate(appointment.date)} às {appointment.start_time}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            💰 R$ {appointment.price_charged}
                          </Typography>
                        </Box>
                        <Chip
                          label={getStatusLabel(appointment.status)}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
