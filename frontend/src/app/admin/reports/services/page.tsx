'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  GridLegacy as Grid,
  Card,
  CardContent,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface ServiceReport {
  service_id: number;
  service_name: string;
  total_revenue: number;
  total_appointments: number;
  completed_appointments: number;
  average_price: number;
}

export default function ServiceRevenueReportPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ServiceReport[]>([]);
  const [period, setPeriod] = useState('current_month');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'OWNER')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'OWNER') {
      loadReports();
    }
  }, [user, period]);

  const loadReports = async () => {
    try {
      setLoading(true);

      // Calculate date range
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

      // Group by service
      const serviceMap = new Map<number, ServiceReport>();

      appointments.forEach((apt: any) => {
        const serviceId = apt.service;
        const serviceName = apt.service_name;

        if (!serviceMap.has(serviceId)) {
          serviceMap.set(serviceId, {
            service_id: serviceId,
            service_name: serviceName,
            total_revenue: 0,
            total_appointments: 0,
            completed_appointments: 0,
            average_price: 0,
          });
        }

        const report = serviceMap.get(serviceId)!;
        report.total_appointments++;

        if (apt.status === 'COMPLETED') {
          report.completed_appointments++;
          report.total_revenue += parseFloat(apt.price_charged);
        }
      });

      // Calculate average price
      const reportsArray = Array.from(serviceMap.values()).map(report => ({
        ...report,
        average_price: report.completed_appointments > 0
          ? report.total_revenue / report.completed_appointments
          : 0,
      }));

      // Sort by revenue descending
      reportsArray.sort((a, b) => b.total_revenue - a.total_revenue);

      setReports(reportsArray);
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
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

  const totalRevenue = reports.reduce((sum, r) => sum + r.total_revenue, 0);
  const totalAppointments = reports.reduce((sum, r) => sum + r.total_appointments, 0);
  const totalCompleted = reports.reduce((sum, r) => sum + r.completed_appointments, 0);

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Faturamento por Serviço
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
        ) : (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoneyIcon sx={{ fontSize: 32, color: 'success.main', mr: 1 }} />
                      <Typography variant="h6" color="text.secondary">
                        Faturamento Total
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {formatCurrency(totalRevenue)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EventIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                      <Typography variant="h6" color="text.secondary">
                        Total Agendamentos
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {totalAppointments}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ContentCutIcon sx={{ fontSize: 32, color: 'info.main', mr: 1 }} />
                      <Typography variant="h6" color="text.secondary">
                        Serviços Ativos
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                      {reports.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Report Table */}
            <Paper>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  Relatório Detalhado - {getPeriodLabel()}
                </Typography>
              </Box>
              {reports.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Nenhum dado disponível para o período selecionado.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Posição</TableCell>
                        <TableCell>Serviço</TableCell>
                        <TableCell align="right">Faturamento</TableCell>
                        <TableCell align="center">Agendamentos</TableCell>
                        <TableCell align="center">Concluídos</TableCell>
                        <TableCell align="right">Preço Médio</TableCell>
                        <TableCell align="right">% do Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reports.map((report, index) => (
                        <TableRow key={report.service_id}>
                          <TableCell>#{index + 1}</TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight="medium">
                              {report.service_name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              {formatCurrency(report.total_revenue)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">{report.total_appointments}</TableCell>
                          <TableCell align="center">{report.completed_appointments}</TableCell>
                          <TableCell align="right">{formatCurrency(report.average_price)}</TableCell>
                          <TableCell align="right">
                            {totalRevenue > 0
                              ? `${((report.total_revenue / totalRevenue) * 100).toFixed(1)}%`
                              : '0%'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
}
