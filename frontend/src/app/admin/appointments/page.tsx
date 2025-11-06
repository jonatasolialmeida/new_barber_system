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
  Chip,
  CircularProgress,
  TextField,
  GridLegacy as Grid,
  Button,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface Appointment {
  id: number;
  service_name: string;
  barber_name: string;
  client_name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  price_charged: string;
}

export default function AllAppointmentsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'OWNER')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'OWNER') {
      loadAppointments();
    }
  }, [user]);

  useEffect(() => {
    filterAppointments();
    setPage(1);
  }, [appointments, startDate, endDate, statusFilter]);

  const loadAppointments = async () => {
    try {
      const response = await api.get('/appointments/');
      const data = response.data.results || response.data;
      // Add client_name to appointments
      const appointmentsWithClient = data.map((apt: any) => ({
        ...apt,
        client_name: apt.client_name || 'Cliente',
      }));
      setAppointments(appointmentsWithClient);
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Apply date filters
    if (startDate) {
      filtered = filtered.filter(apt => new Date(apt.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(apt => new Date(apt.date) <= new Date(endDate));
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
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
          <Typography variant="h4" component="h1">
            Todos os Agendamentos
          </Typography>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="date"
                label="Data Inicial"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                type="date"
                label="Data Final"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="SCHEDULED">Agendado</MenuItem>
                  <MenuItem value="CONFIRMED">Confirmado</MenuItem>
                  <MenuItem value="IN_PROGRESS">Em Andamento</MenuItem>
                  <MenuItem value="COMPLETED">Concluído</MenuItem>
                  <MenuItem value="CANCELLED">Cancelado</MenuItem>
                  <MenuItem value="NO_SHOW">Não Compareceu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                disabled={!startDate && !endDate && statusFilter === 'all'}
              >
                Limpar Filtros
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total: {filteredAppointments.length} agendamento(s)
            </Typography>
          </Box>
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : filteredAppointments.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Nenhum agendamento encontrado com os filtros aplicados.
            </Typography>
          </Paper>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Barbeiro</TableCell>
                    <TableCell>Serviço</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Horário</TableCell>
                    <TableCell align="right">Valor</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>#{appointment.id}</TableCell>
                        <TableCell>{appointment.client_name}</TableCell>
                        <TableCell>{appointment.barber_name}</TableCell>
                        <TableCell>{appointment.service_name}</TableCell>
                        <TableCell>{formatDate(appointment.date)}</TableCell>
                        <TableCell>
                          {appointment.start_time} - {appointment.end_time}
                        </TableCell>
                        <TableCell align="right">R$ {appointment.price_charged}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getStatusLabel(appointment.status)}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {filteredAppointments.length > itemsPerPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={Math.ceil(filteredAppointments.length / itemsPerPage)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}
