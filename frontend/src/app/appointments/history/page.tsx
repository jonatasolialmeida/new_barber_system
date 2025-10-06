'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  TextField,
  Grid,
  Pagination,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

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

export default function AppointmentHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; appointment: Appointment | null }>({
    open: false,
    appointment: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Date filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  useEffect(() => {
    // Check if status param is set (from dashboard click)
    const statusParam = searchParams.get('status');
    if (statusParam === 'COMPLETED') {
      setTabValue(1); // Concluídos tab
    }
  }, [searchParams]);

  useEffect(() => {
    filterAppointments();
    setPage(1); // Reset to first page when filters change
  }, [tabValue, appointments, startDate, endDate]);

  const loadAppointments = async () => {
    try {
      const response = await api.get('/appointments/');
      const data = response.data.results || response.data;
      setAppointments(data);
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
      setError('Erro ao carregar histórico de agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = appointments;

    // Apply date filters
    if (startDate) {
      filtered = filtered.filter(apt => new Date(apt.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(apt => new Date(apt.date) <= new Date(endDate));
    }

    // Apply tab filter
    switch (tabValue) {
      case 0: // Próximos
        filtered = filtered.filter(
          (apt) =>
            new Date(apt.date + 'T00:00:00') >= today &&
            ['SCHEDULED', 'CONFIRMED'].includes(apt.status)
        );
        break;
      case 1: // Concluídos
        filtered = filtered.filter((apt) => apt.status === 'COMPLETED');
        break;
      case 2: // Cancelados
        filtered = filtered.filter((apt) => ['CANCELLED', 'NO_SHOW'].includes(apt.status));
        break;
      case 3: // Todos
        // No additional filter
        break;
    }

    setFilteredAppointments(filtered);
  };

  const clearDateFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleCancelAppointment = async () => {
    if (!cancelDialog.appointment) return;

    try {
      await api.post(`/appointments/${cancelDialog.appointment.id}/cancel/`);

      setSuccess('Agendamento cancelado com sucesso!');
      setCancelDialog({ open: false, appointment: null });
      loadAppointments();
    } catch (err: any) {
      setError('Erro ao cancelar agendamento.');
    }
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

  const canCancel = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.date + 'T' + appointment.start_time);
    const now = new Date();
    const hoursDiff = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    return (
      ['SCHEDULED', 'CONFIRMED'].includes(appointment.status) &&
      hoursDiff > 2 // Pode cancelar com pelo menos 2 horas de antecedência
    );
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => router.push('/dashboard')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Meus Agendamentos
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Próximos" />
            <Tab label="Concluídos" />
            <Tab label="Cancelados" />
            <Tab label="Todos" />
          </Tabs>
        </Paper>

        {/* Date Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filtrar por Data
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                type="date"
                label="Data Inicial"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                type="date"
                label="Data Final"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearDateFilters}
                disabled={!startDate && !endDate}
              >
                Limpar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : filteredAppointments.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Nenhum agendamento encontrado nesta categoria.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => router.push('/appointments/new')}
            >
              Fazer Novo Agendamento
            </Button>
          </Paper>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Serviço</TableCell>
                    <TableCell>Barbeiro</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Horário</TableCell>
                    <TableCell align="right">Valor</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.service_name}</TableCell>
                        <TableCell>{appointment.barber_name}</TableCell>
                        <TableCell>{formatDate(appointment.date)}</TableCell>
                        <TableCell>{appointment.start_time}</TableCell>
                        <TableCell align="right">R$ {appointment.price_charged}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getStatusLabel(appointment.status)}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {canCancel(appointment) && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setCancelDialog({ open: true, appointment })}
                              title="Cancelar agendamento"
                            >
                              <CancelIcon />
                            </IconButton>
                          )}
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

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, appointment: null })}
      >
        <DialogTitle>Cancelar Agendamento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja cancelar o agendamento de{' '}
            <strong>{cancelDialog.appointment?.service_name}</strong> no dia{' '}
            <strong>{cancelDialog.appointment && formatDate(cancelDialog.appointment.date)}</strong>{' '}
            às <strong>{cancelDialog.appointment?.start_time}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, appointment: null })}>
            Não
          </Button>
          <Button onClick={handleCancelAppointment} color="error" variant="contained">
            Sim, Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
