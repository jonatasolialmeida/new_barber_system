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
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface Barber {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function BarbersManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; barber: Barber | null }>({
    open: false,
    barber: null,
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'OWNER')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'OWNER') {
      loadBarbers();
    }
  }, [user]);

  const loadBarbers = async () => {
    try {
      const response = await api.get('/users/');
      const allUsers = response.data.results || response.data;
      // Filter only barbers and owners
      const barberUsers = allUsers.filter((u: Barber) => ['BARBER', 'OWNER'].includes(u.role));
      setBarbers(barberUsers);
    } catch (err) {
      console.error('Erro ao carregar barbeiros:', err);
      setError('Erro ao carregar lista de barbeiros.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (barber: Barber) => {
    try {
      await api.patch(`/users/${barber.id}/`, {
        is_active: !barber.is_active,
      });
      setSuccess(`Barbeiro ${!barber.is_active ? 'ativado' : 'desativado'} com sucesso!`);
      loadBarbers();
    } catch (err) {
      setError('Erro ao alterar status do barbeiro.');
    }
  };

  const handleDeleteBarber = async () => {
    if (!deleteDialog.barber) return;

    try {
      await api.delete(`/users/${deleteDialog.barber.id}/`);
      setSuccess('Barbeiro removido com sucesso!');
      setDeleteDialog({ open: false, barber: null });
      loadBarbers();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao remover barbeiro.');
      setDeleteDialog({ open: false, barber: null });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
            Gerenciar Barbeiros
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/register-barber')}
          >
            Novo Barbeiro
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
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : barbers.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary" gutterBottom>
              Nenhum barbeiro cadastrado ainda.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
              onClick={() => router.push('/admin/register-barber')}
            >
              Cadastrar Primeiro Barbeiro
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell align="center">Tipo</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Cadastro</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {barbers.map((barber) => (
                  <TableRow key={barber.id}>
                    <TableCell>
                      {barber.first_name} {barber.last_name}
                    </TableCell>
                    <TableCell>{barber.email}</TableCell>
                    <TableCell>{barber.phone || '-'}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={barber.role === 'OWNER' ? 'Proprietário' : 'Barbeiro'}
                        color={barber.role === 'OWNER' ? 'secondary' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={barber.is_active ? <CheckCircleIcon /> : <BlockIcon />}
                        label={barber.is_active ? 'Ativo' : 'Inativo'}
                        color={barber.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{formatDate(barber.created_at)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color={barber.is_active ? 'warning' : 'success'}
                        onClick={() => handleToggleActive(barber)}
                        title={barber.is_active ? 'Desativar' : 'Ativar'}
                      >
                        {barber.is_active ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, barber })}
                        title="Excluir"
                        disabled={barber.id === user.id} // Can't delete yourself
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, barber: null })}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o barbeiro{' '}
            <strong>
              {deleteDialog.barber?.first_name} {deleteDialog.barber?.last_name}
            </strong>
            ? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, barber: null })}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteBarber} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
