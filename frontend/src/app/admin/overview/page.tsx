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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface FinancialSummary {
  total_revenue: number;
  total_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  average_ticket: number;
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [period, setPeriod] = useState('current_month');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'OWNER')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'OWNER') {
      loadSummary();
    }
  }, [user, period]);

  const loadSummary = async () => {
    try {
      setLoading(true);

      // Calculate date range based on period
      const now = new Date();
      let startDate = '';
      let endDate = now.toISOString().split('T')[0];

      switch (period) {
        case 'current_month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          break;
        case 'last_month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          startDate = lastMonth.toISOString().split('T')[0];
          endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
          break;
        case 'current_year':
          startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
          break;
        case 'all_time':
          startDate = '';
          endDate = '';
          break;
      }

      // Fetch appointments
      const params: any = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await api.get('/appointments/', { params });
      const appointments = response.data.results || response.data;

      // Calculate summary
      const completed = appointments.filter((a: any) => a.status === 'COMPLETED');
      const cancelled = appointments.filter((a: any) => ['CANCELLED', 'NO_SHOW'].includes(a.status));
      const totalRevenue = completed.reduce((sum: number, a: any) => sum + parseFloat(a.price_charged), 0);
      const averageTicket = completed.length > 0 ? totalRevenue / completed.length : 0;

      setSummary({
        total_revenue: totalRevenue,
        total_appointments: appointments.length,
        completed_appointments: completed.length,
        cancelled_appointments: cancelled.length,
        average_ticket: averageTicket,
      });
    } catch (err) {
      console.error('Erro ao carregar resumo:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'current_month':
        return 'Mês Atual';
      case 'last_month':
        return 'Mês Anterior';
      case 'current_year':
        return 'Ano Atual';
      case 'all_time':
        return 'Todo o Período';
      default:
        return '';
    }
  };

  if (authLoading || !user || user.role !== 'OWNER') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => router.push('/dashboard')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Dashboard Administrativo
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={period}
              label="Período"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="current_month">Mês Atual</MenuItem>
              <MenuItem value="last_month">Mês Anterior</MenuItem>
              <MenuItem value="current_year">Ano Atual</MenuItem>
              <MenuItem value="all_time">Todo o Período</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : summary ? (
          <>
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Resumo Financeiro - {getPeriodLabel()}
            </Typography>

            <Grid container spacing={3}>
              {/* Total Faturado */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Faturamento
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {formatCurrency(summary.total_revenue)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Total de Agendamentos */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EventIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Agendamentos
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {summary.total_appointments}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {summary.completed_appointments} concluídos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Ticket Médio */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Ticket Médio
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                      {formatCurrency(summary.average_ticket)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Cancelamentos */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EventIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        Cancelados
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {summary.cancelled_appointments}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {summary.total_appointments > 0
                        ? `${((summary.cancelled_appointments / summary.total_appointments) * 100).toFixed(1)}%`
                        : '0%'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Links Rápidos */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Relatórios
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => router.push('/admin/reports/barbers')}
                  >
                    <CardContent>
                      <Typography variant="h6">Faturamento por Barbeiro</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ver relatório detalhado
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => router.push('/admin/reports/services')}
                  >
                    <CardContent>
                      <Typography variant="h6">Faturamento por Serviço</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ver relatório detalhado
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => router.push('/admin/appointments')}
                  >
                    <CardContent>
                      <Typography variant="h6">Todos os Agendamentos</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Visualizar e gerenciar
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : null}
      </Box>
    </Container>
  );
}
