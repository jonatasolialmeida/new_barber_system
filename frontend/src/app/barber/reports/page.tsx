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
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface Appointment {
  id: number;
  client_name: string;
  service_name: string;
  date: string;
  start_time: string;
  status: string;
  price_charged: string;
}

export default function BarberReportsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1); // Primeiro dia do mês
    return date.toISOString().split('T')[0];
  });

  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'BARBER')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'BARBER') {
      loadAppointments();
    }
  }, [user, startDate, endDate]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/appointments/', {
        params: {
          start_date: startDate,
          end_date: endDate,
          status: 'COMPLETED',
        },
      });
      setAppointments(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao carregar relatório:', err);
      setError('Erro ao carregar relatório.');
    } finally {
      setLoading(false);
    }
  };

  const setQuickPeriod = (period: 'week' | 'month' | 'year') => {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setDate(1);
        break;
      case 'year':
        start.setMonth(0, 1);
        break;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const totalEarnings = appointments.reduce((sum, apt) => sum + parseFloat(apt.price_charged || '0'), 0);
  const totalAppointments = appointments.length;
  const avgPerAppointment = totalAppointments > 0 ? totalEarnings / totalAppointments : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => router.push('/dashboard')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Meus Relatórios
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Period Selection */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Período
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Button size="small" variant="outlined" onClick={() => setQuickPeriod('week')}>
              Última Semana
            </Button>
            <Button size="small" variant="outlined" onClick={() => setQuickPeriod('month')}>
              Este Mês
            </Button>
            <Button size="small" variant="outlined" onClick={() => setQuickPeriod('year')}>
              Este Ano
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Data Início"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Data Fim"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoneyIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Ganhos
                  </Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {formatCurrency(totalEarnings)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Atendimentos
                  </Typography>
                </Box>
                <Typography variant="h4" color="primary.main">
                  {totalAppointments}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Média por Atendimento
                  </Typography>
                </Box>
                <Typography variant="h4" color="info.main">
                  {formatCurrency(avgPerAppointment)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Appointments Table */}
        <Paper>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Lista de Atendimentos" />
            </Tabs>
          </Box>

          <Box sx={{ p: 2 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : appointments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  Nenhum atendimento concluído neste período.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell>Horário</TableCell>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Serviço</TableCell>
                      <TableCell align="right">Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell>{formatDate(apt.date)}</TableCell>
                        <TableCell>{apt.start_time}</TableCell>
                        <TableCell>{apt.client_name}</TableCell>
                        <TableCell>{apt.service_name}</TableCell>
                        <TableCell align="right">
                          <Typography color="success.main" fontWeight="bold">
                            {formatCurrency(parseFloat(apt.price_charged))}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} align="right">
                        <Typography variant="h6">Total:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="success.main">
                          {formatCurrency(totalEarnings)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
