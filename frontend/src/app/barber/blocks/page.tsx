'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface ScheduleBlock {
  id: number;
  date: string;
  start_time: string | null;
  end_time: string | null;
  all_day: boolean;
  reason: string;
}

export default function BarberBlocksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
    end_time: '',
    all_day: false,
    reason: '',
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'BARBER')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'BARBER') {
      loadBlocks();
    }
  }, [user]);

  const loadBlocks = async () => {
    try {
      const response = await api.get('/users/schedule-blocks/');
      setBlocks(response.data.results || response.data);
    } catch (err) {
      console.error('Erro ao carregar bloqueios:', err);
      setError('Erro ao carregar bloqueios de agenda.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    try {
      const dataToSend: any = {
        date: formData.date,
        all_day: formData.all_day,
        reason: formData.reason,
      };

      if (!formData.all_day) {
        dataToSend.start_time = formData.start_time;
        dataToSend.end_time = formData.end_time;
      }

      await api.post('/users/schedule-blocks/', dataToSend);
      setSuccess('Bloqueio criado com sucesso!');
      setDialogOpen(false);
      setFormData({
        date: '',
        start_time: '',
        end_time: '',
        all_day: false,
        reason: '',
      });
      loadBlocks();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail ||
                       err.response?.data?.non_field_errors?.[0] ||
                       'Erro ao criar bloqueio.';
      setError(errorMsg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este bloqueio?')) return;

    try {
      await api.delete(`/users/schedule-blocks/${id}/`);
      setSuccess('Bloqueio removido com sucesso!');
      loadBlocks();
    } catch (err) {
      setError('Erro ao remover bloqueio.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => router.push('/barber/schedule')} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Bloquear Horários
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Novo Bloqueio
          </Button>
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

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : blocks.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              Nenhum bloqueio de horário cadastrado.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Criar Primeiro Bloqueio
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  <TableCell>Horário</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blocks.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell>{formatDate(block.date)}</TableCell>
                    <TableCell>
                      {block.all_day ? (
                        <Chip label="Dia todo" color="warning" size="small" />
                      ) : (
                        `${block.start_time} - ${block.end_time}`
                      )}
                    </TableCell>
                    <TableCell>{block.reason || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(block.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Create Block Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Bloqueio de Horário</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Data"
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.all_day}
                    onChange={handleChange}
                    name="all_day"
                  />
                }
                label="Bloquear o dia todo"
              />
            </Grid>

            {!formData.all_day && (
              <>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Horário Início"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Horário Fim"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Motivo (opcional)"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Ex: Férias, Compromisso pessoal..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Criar Bloqueio
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
